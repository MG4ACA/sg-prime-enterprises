const db = require('../config/database');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [categories] = await db.query('SELECT * FROM categories WHERE slug = ?', [slug]);

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    next(error);
  }
};

// Create new category (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;

    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description],
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        id: result.insertId,
        name,
        slug,
        description,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const [result] = await db.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const [products] = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id],
    );

    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${products[0].count} product(s) associated with it.`,
      });
    }

    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
