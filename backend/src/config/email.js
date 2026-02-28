const nodemailer = require('nodemailer');
require('dotenv').config();

const port = parseInt(process.env.EMAIL_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: port,
  secure: port === 465, // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Required for Hostinger mail - do not fail on invalid certs
    rejectUnauthorized: true,
  },
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️  Email configuration issue:', error.message);
  } else {
    console.log('✅ Email server ready');
  }
});

module.exports = transporter;
