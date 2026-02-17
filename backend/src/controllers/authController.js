const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // For production, you should hash the password in .env
    // For now, doing simple comparison (update this for production)
    if (password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username: adminUsername,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        username: adminUsername,
        role: 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  // If we reach here, the auth middleware has already verified the token
  res.json({
    success: true,
    data: {
      username: req.admin.username,
      role: req.admin.role,
    },
  });
};
