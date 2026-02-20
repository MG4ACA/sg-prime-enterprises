const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;
const { validationResult } = require('express-validator');

// Get all products with optional filtering
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, featured, status = 'active' } = req.query;

    // When status is 'all' (admin), return every product regardless of status
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

    // Additional filters (only applied if we didn't already get all)
    if (category) {
      query += params.length ? ' AND c.slug = ?' : ' WHERE c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += params.length ? ' AND p.is_featured = TRUE' : ' WHERE p.is_featured = TRUE';
    }

    query += ' ORDER BY p.display_order ASC, p.created_at DESC';

    const [products] = await db.query(query, params);

    // Parse JSON specs
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

// Get single product by ID
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
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = {
      ...products[0],
      specs:
        typeof products[0].specs === 'string' ? JSON.parse(products[0].specs) : products[0].specs,
    };

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create new product (Admin only)
exports.createProduct = async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
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

    // Handle image upload
    let image_url = null;
    if (req.file) {
      image_url = '/uploads/products/' + req.file.filename;
    }

    // Parse specs if it's a string (guard against empty string)
    const specsJson = specs && typeof specs === 'string' ? JSON.parse(specs) : specs || {};

    const [result] = await db.query(
      `INSERT INTO products 
       (category_id, name, description, specs, image_url, is_featured, display_order, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        description,
        JSON.stringify(specsJson),
        image_url,
        is_featured,
        display_order,
        status,
      ],
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: result.insertId,
        category_id,
        name,
        description,
        specs: specsJson,
        image_url,
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

    // Get existing product
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Handle image upload
    let image_url = existing[0].image_url;
    if (req.file) {
      // Delete old image if exists
      if (existing[0].image_url) {
        const oldImagePath = path.join(__dirname, '../../', existing[0].image_url);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.log('Old image not found or already deleted');
        }
      }
      image_url = '/uploads/products/' + req.file.filename;
    }

    // Parse specs if it's a string (guard against empty string)
    const specsJson = specs && typeof specs === 'string' ? JSON.parse(specs) : specs || {};

    await db.query(
      `UPDATE products 
       SET category_id = ?, name = ?, description = ?, specs = ?, 
           image_url = ?, is_featured = ?, display_order = ?, status = ?
       WHERE id = ?`,
      [
        category_id,
        name,
        description,
        JSON.stringify(specsJson),
        image_url,
        is_featured,
        display_order,
        status,
        id,
      ],
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get product to delete image
    const [products] = await db.query('SELECT image_url FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete image file if exists
    if (products[0].image_url) {
      const imagePath = path.join(__dirname, '../../', products[0].image_url);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log('Image file not found or already deleted');
      }
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
