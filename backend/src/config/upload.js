const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use absolute path from backend root
    const uploadDir = path.join(__dirname, '../../uploads/products');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'), false);
  }
};

// Upload middleware factory
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
});

// Single image upload (legacy / avatar use cases)
upload.single_ = upload.single('image');

// Multiple images upload — up to 5 per product
upload.multipleProducts = upload.array('images', 5);

module.exports = upload;
