const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
require('dotenv').config();

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Look up admin in DB
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ? AND is_active = TRUE',
      [username],
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const admin = rows[0];

    // Compare password with bcrypt hash
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last_login timestamp
    await pool.execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

    // Issue JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: { token, username: admin.username, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY TOKEN ────────────────────────────────────────────────────────────
exports.verifyToken = async (req, res) => {
  res.json({
    success: true,
    data: { username: req.admin.username, role: req.admin.role },
  });
};

// ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Fetch admin from DB
    const [rows] = await pool.execute('SELECT * FROM admins WHERE id = ? AND is_active = TRUE', [
      req.admin.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash and update new password
    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, req.admin.id]);

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
