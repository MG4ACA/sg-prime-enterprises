const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { body } = require('express-validator');

// Validation middleware
const validateEnquiry = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// Public route - Submit enquiry
router.post('/', validateEnquiry, enquiryController.createEnquiry);

module.exports = router;
