/**
 * Production Database Migration Script
 * 
 * This script safely migrates your existing database to include the enquiries table
 * Run this on your production server BEFORE deploying the new code
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
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log('✅ Connected to database:', process.env.DB_NAME);
    
    // Check if enquiries table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'enquiries'"
    );
    
    if (tables.length > 0) {
      console.log('ℹ️  Enquiries table already exists - skipping creation');
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
      
      console.log('✅ Enquiries table created successfully');
    }
    
    // Verify all required tables exist
    console.log('\n📊 Verifying database schema...');
    
    const requiredTables = ['admins', 'categories', 'products', 'enquiries'];
    const [allTables] = await connection.query('SHOW TABLES');
    const existingTables = allTables.map(row => Object.values(row)[0]);
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('⚠️  Please run the full setup script: cd database && npm run setup');
    } else {
      console.log('✅ All required tables exist');
      
      // Show table counts
      for (const table of requiredTables) {
        const [result] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   - ${table}: ${result[0].count} records`);
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Verify the migration by checking the database');
    console.log('   2. Deploy the new backend code');
    console.log('   3. Restart the backend server');
    console.log('   4. Test the enquiry form on the frontend\n');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
