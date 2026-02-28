const db = require('../config/database');
const emailTransporter = require('../config/email');
const { validationResult } = require('express-validator');

// Submit new enquiry
exports.createEnquiry = async (req, res, next) => {
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
    const { name, email, company, phone, message, product_id } = req.body;

    // Insert into database
    const [result] = await db.query(
      `INSERT INTO enquiries (name, email, company, phone, message, product_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email, company, phone, message, product_id || null],
    );

    // Get product name if product_id is provided
    let productName = null;
    if (product_id) {
      const [products] = await db.query('SELECT name FROM products WHERE id = ?', [product_id]);
      productName = products.length > 0 ? products[0].name : null;
    }

    // Send email notification
    // 1. Notify admin of new enquiry (always attempt)
    try {
      const adminMailOptions = {
        from: `"SG Prime Enterprises" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New Enquiry #${result.insertId} from ${name} - SG Prime Enterprises`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #FFF1E8; padding: 20px; }
              .container { background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; }
              .header { background-color: #9A5A2E; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #3E1F0F; }
              .value { color: #333; margin-top: 5px; }
              .footer { background-color: #FFF1E8; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Customer Enquiry</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Enquiry ID:</div>
                  <div class="value">#${result.insertId}</div>
                </div>
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${email}</div>
                </div>
                ${company ? `<div class="field"><div class="label">Company:</div><div class="value">${company}</div></div>` : ''}
                ${phone ? `<div class="field"><div class="label">Phone:</div><div class="value">${phone}</div></div>` : ''}
                ${productName ? `<div class="field"><div class="label">Product of Interest:</div><div class="value">${productName}</div></div>` : ''}
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message}</div>
                </div>
              </div>
              <div class="footer">
                <p>SG Prime Enterprises - Industrial Coir Products</p>
                <p>This is an automated notification. Please log in to the admin panel to manage this enquiry.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
      await emailTransporter.sendMail(adminMailOptions);
    } catch (adminEmailError) {
      console.error('Admin notification email failed:', adminEmailError.message);
      // Don't fail the request if admin email fails
    }

    // 2. Send auto-reply confirmation to the customer (independent — failure here won't affect admin notification)
    try {
      const customerMailOptions = {
        from: `"SG Prime Enterprises" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We've received your enquiry - SG Prime Enterprises`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #FFF1E8; padding: 20px; }
              .container { background-color: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; }
              .header { background-color: #9A5A2E; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; color: #333; line-height: 1.6; }
              .highlight { background-color: #FFF1E8; border-left: 4px solid #9A5A2E; padding: 12px 16px; margin: 16px 0; }
              .footer { background-color: #FFF1E8; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Enquiry!</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to SG Prime Enterprises. We have received your enquiry and our team will get back to you within <strong>1–2 business days</strong>.</p>
                <div class="highlight">
                  <strong>Your Enquiry Reference:</strong> #${result.insertId}<br/>
                  ${productName ? `<strong>Product of Interest:</strong> ${productName}<br/>` : ''}
                  <strong>Your Message:</strong> ${message}
                </div>
                <p>If you have any urgent queries, feel free to contact us directly at <a href="mailto:info@sgprimeenterprises.com">info@sgprimeenterprises.com</a>.</p>
              </div>
              <div style="padding: 20px 0 10px 0;">
                <img src="https://sgprimeenterprises.com/email-signature.png" alt="SG Prime Enterprises" style="max-width: 500px; width: 100%; height: auto; display: block;" />
              </div>
              <div class="footer">
                <p>SG Prime Enterprises - Industrial Coir Products</p>
                <p><a href="https://sgprimeenterprises.com">sgprimeenterprises.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
      await emailTransporter.sendMail(customerMailOptions);
    } catch (customerEmailError) {
      console.error(
        'Customer auto-reply email failed (recipient may have invalid domain):',
        customerEmailError.message,
      );
      // Don't fail the request — the enquiry is saved and admin was already notified
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. We will get back to you soon!',
      data: {
        id: result.insertId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all enquiries (Admin only)
exports.getAllEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT e.*, p.name as product_name 
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE e.status = ?';
      params.push(status);
    }

    query += ' ORDER BY e.created_at DESC';

    const [enquiries] = await db.query(query, params);

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// Get single enquiry (Admin only)
exports.getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [enquiries] = await db.query(
      `SELECT e.*, p.name as product_name 
       FROM enquiries e
       LEFT JOIN products p ON e.product_id = p.id
       WHERE e.id = ?`,
      [id],
    );

    if (enquiries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      data: enquiries[0],
    });
  } catch (error) {
    next(error);
  }
};

// Update enquiry status (Admin only)
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'contacted', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const [result] = await db.query('UPDATE enquiries SET status = ?, notes = ? WHERE id = ?', [
      status,
      notes || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete enquiry (Admin only)
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM enquiries WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
