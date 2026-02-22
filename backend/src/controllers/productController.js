const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Safely delete a file from disk (no-op if missing). */
async function unlinkSafe(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (_) {
    // ignore
  }
}

/**
 * Build the full disk path from a stored URL such as "/uploads/products/x.jpg".
 * Resolves relative to the backend root (two levels above this controller).
 */
function urlToDiskPath(imageUrl) {
  const relative = imageUrl.replace(/^\//, '');
  return path.join(__dirname, '../../', relative);
}

/**
 * Fetch all images for a product, ordered by display_order.
 * Returns [] when the product has no images yet.
 */
async function fetchImages(productId) {
  const [rows] = await db.query(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC',
    [productId],
  );
  return rows;
}

/**
 * After any change to product_images, keep products.image_url in sync
 * with the current primary image (for backward-compat with listing queries).
 */
async function syncPrimaryUrl(productId) {
  const [rows] = await db.query(
    'SELECT image_url FROM product_images WHERE product_id = ? AND is_primary = TRUE LIMIT 1',
    [productId],
  );
  const primaryUrl = rows.length > 0 ? rows[0].image_url : null;
  await db.query('UPDATE products SET image_url = ? WHERE id = ?', [primaryUrl, productId]);
}

// ─── controllers ─────────────────────────────────────────────────────────────

// Get all products with optional filtering
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, featured, status = 'active' } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `;
    const params = [];

    if (status !== 'all') {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    if (category) {
      query += params.length ? ' AND c.slug = ?' : ' WHERE c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += params.length ? ' AND p.is_featured = TRUE' : ' WHERE p.is_featured = TRUE';
    }

    query += ' ORDER BY p.display_order ASC, p.created_at DESC';

    const [products] = await db.query(query, params);

    const processedProducts = products.map((product) => ({
      ...product,
      specs: typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs,
    }));

    res.json({
      success: true,
      count: processedProducts.length,
      data: processedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID — includes full images array
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id],
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const images = await fetchImages(id);

    const product = {
      ...products[0],
      specs:
        typeof products[0].specs === 'string' ? JSON.parse(products[0].specs) : products[0].specs,
      images,
    };

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Create new product (Admin only)
exports.createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  try {
    const {
      category_id,
      name,
      description,
      specs,
      is_featured = false,
      display_order = 0,
      status = 'active',
    } = req.body;

    const specsJson = specs && typeof specs === 'string' ? JSON.parse(specs) : specs || {};

    // Insert product first (image_url set later via syncPrimaryUrl)
    const [result] = await db.query(
      `INSERT INTO products 
       (category_id, name, description, specs, image_url, is_featured, display_order, status) 
       VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`,
      [
        category_id,
        name,
        description,
        JSON.stringify(specsJson),
        is_featured,
        display_order,
        status,
      ],
    );

    const productId = result.insertId;

    // Insert uploaded images into product_images
    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      const imgUrl = '/uploads/products/' + files[i].filename;
      await db.query(
        'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
        [productId, imgUrl, i === 0, i],
      );
    }

    await syncPrimaryUrl(productId);

    const images = await fetchImages(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: productId,
        category_id,
        name,
        description,
        specs: specsJson,
        image_url: images.length > 0 ? images[0].image_url : null,
        images,
        is_featured,
        display_order,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, specs, is_featured, display_order, status } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const specsJson = specs && typeof specs === 'string' ? JSON.parse(specs) : specs || {};

    await db.query(
      `UPDATE products 
       SET category_id = ?, name = ?, description = ?, specs = ?,
           is_featured = ?, display_order = ?, status = ?
       WHERE id = ?`,
      [
        category_id,
        name,
        description,
        JSON.stringify(specsJson),
        is_featured,
        display_order,
        status,
        id,
      ],
    );

    // Append any newly uploaded images
    const files = req.files || [];
    if (files.length > 0) {
      // Get the current highest display_order for this product's images
      const [maxOrderRows] = await db.query(
        'SELECT COALESCE(MAX(display_order), -1) as maxOrder FROM product_images WHERE product_id = ?',
        [id],
      );
      let nextOrder = maxOrderRows[0].maxOrder + 1;

      // Check if this product currently has no images (first upload = primary)
      const [countRows] = await db.query(
        'SELECT COUNT(*) as cnt FROM product_images WHERE product_id = ?',
        [id],
      );
      const hasImages = countRows[0].cnt > 0;

      for (let i = 0; i < files.length; i++) {
        const imgUrl = '/uploads/products/' + files[i].filename;
        const isPrimary = !hasImages && i === 0; // only mark primary if product had no images
        await db.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [id, imgUrl, isPrimary, nextOrder + i],
        );
      }

      await syncPrimaryUrl(id);
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [products] = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete all image files from disk
    const images = await fetchImages(id);
    for (const img of images) {
      await unlinkSafe(urlToDiskPath(img.image_url));
    }

    // Also clean up the legacy image_url file if it somehow differs
    const [prod] = await db.query('SELECT image_url FROM products WHERE id = ?', [id]);
    if (prod[0]?.image_url) {
      await unlinkSafe(urlToDiskPath(prod[0].image_url));
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a single product image (Admin only)
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;

    const [rows] = await db.query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [
      imageId,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    const image = rows[0];

    // Delete from disk
    await unlinkSafe(urlToDiskPath(image.image_url));

    // Delete from DB
    await db.query('DELETE FROM product_images WHERE id = ?', [imageId]);

    // If the deleted image was primary, promote the next image
    if (image.is_primary) {
      const [remaining] = await db.query(
        'SELECT id FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC LIMIT 1',
        [id],
      );
      if (remaining.length > 0) {
        await db.query('UPDATE product_images SET is_primary = TRUE WHERE id = ?', [
          remaining[0].id,
        ]);
      }
    }

    await syncPrimaryUrl(id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Set a specific image as primary (Admin only)
exports.setProductImagePrimary = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;

    const [rows] = await db.query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [
      imageId,
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Clear existing primary
    await db.query('UPDATE product_images SET is_primary = FALSE WHERE product_id = ?', [id]);
    // Set new primary
    await db.query('UPDATE product_images SET is_primary = TRUE WHERE id = ?', [imageId]);

    await syncPrimaryUrl(id);

    res.json({ success: true, message: 'Primary image updated' });
  } catch (error) {
    next(error);
  }
};
