const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const enquiryController = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/auth');
const upload = require('../config/upload');
const { body } = require('express-validator');

// ============================================
// AUTHENTICATION ROUTES
// ============================================
router.post('/login', authController.login);
router.get('/verify', authMiddleware, authController.verifyToken);

// ============================================
// CATEGORY MANAGEMENT (Protected)
// ============================================
router.post(
  '/categories',
  authMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
  ],
  categoryController.createCategory,
);

router.put('/categories/:id', authMiddleware, categoryController.updateCategory);

router.delete('/categories/:id', authMiddleware, categoryController.deleteCategory);

// ============================================
// PRODUCT MANAGEMENT (Protected)
// ============================================
router.post(
  '/products',
  authMiddleware,
  upload.single('image'),
  [
    body('category_id').notEmpty().withMessage('Category is required'),
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  productController.createProduct,
);

router.put(
  '/products/:id',
  authMiddleware,
  upload.single('image'),
  productController.updateProduct,
);

router.delete('/products/:id', authMiddleware, productController.deleteProduct);

// ============================================
// ENQUIRY MANAGEMENT (Protected)
// ============================================
router.get('/enquiries', authMiddleware, enquiryController.getAllEnquiries);
router.get('/enquiries/:id', authMiddleware, enquiryController.getEnquiryById);
router.put('/enquiries/:id', authMiddleware, enquiryController.updateEnquiryStatus);
router.delete('/enquiries/:id', authMiddleware, enquiryController.deleteEnquiry);

module.exports = router;
