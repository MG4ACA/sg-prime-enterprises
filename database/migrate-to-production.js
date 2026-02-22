/**
 * Production Database Migration Script
 *
 * Safely migrates the database to support multi-image products.
 * Run this on your production server BEFORE deploying the new code.
 *
 * Usage:
 *   node migrate-to-production.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function migrate() {
  let connection;

  try {
    console.log('🔄 Starting database migration...\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database:', process.env.DB_NAME);

    // ── 1. Enquiries table ───────────────────────────────────────────────────
    const [enquiriesTables] = await connection.query("SHOW TABLES LIKE 'enquiries'");

    if (enquiriesTables.length > 0) {
      console.log('ℹ️  Enquiries table already exists - skipping');
    } else {
      console.log('📝 Creating enquiries table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS enquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          company VARCHAR(150),
          phone VARCHAR(20),
          message TEXT NOT NULL,
          product_id INT,
          status ENUM('pending', 'contacted', 'resolved') DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
          INDEX idx_status (status),
          INDEX idx_created_at (created_at),
          INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ Enquiries table created');
    }

    // ── 2. Product images table ──────────────────────────────────────────────
    const [imgTables] = await connection.query("SHOW TABLES LIKE 'product_images'");

    if (imgTables.length > 0) {
      console.log('ℹ️  product_images table already exists - skipping creation');
    } else {
      console.log('📝 Creating product_images table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS product_images (
          id INT AUTO_INCREMENT PRIMARY KEY,
          product_id INT NOT NULL,
          image_url VARCHAR(500) NOT NULL,
          is_primary BOOLEAN DEFAULT FALSE,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          INDEX idx_product (product_id),
          INDEX idx_primary (product_id, is_primary)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('✅ product_images table created');
    }

    // ── 3. Migrate existing image_url data into product_images ───────────────
    console.log('\n📦 Migrating existing product images...');

    const [products] = await connection.query(
      'SELECT id, image_url FROM products WHERE image_url IS NOT NULL AND image_url != ""',
    );

    let migrated = 0;
    for (const product of products) {
      // Check if this product already has entries in product_images
      const [existing] = await connection.query(
        'SELECT id FROM product_images WHERE product_id = ?',
        [product.id],
      );

      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, TRUE, 0)',
          [product.id, product.image_url],
        );
        migrated++;
      }
    }

    console.log(`✅ Migrated ${migrated} product image(s) into product_images table`);

    // ── 4. Verify schema ─────────────────────────────────────────────────────
    console.log('\n📊 Verifying database schema...');

    const requiredTables = ['admins', 'categories', 'products', 'enquiries', 'product_images'];
    const [allTables] = await connection.query('SHOW TABLES');
    const existingTables = allTables.map((row) => Object.values(row)[0]);
    const missingTables = requiredTables.filter((t) => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('⚠️  Please run the full setup script: cd database && npm run setup');
    } else {
      console.log('✅ All required tables exist');
      for (const table of requiredTables) {
        const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   - ${table}: ${result[0].count} records`);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Deploy the new backend code');
    console.log('   2. Restart the backend server');
    console.log('   3. Test multi-image upload in the admin panel\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
