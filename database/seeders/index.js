const seedCategories = require('./categoriesSeeder');
const seedProducts = require('./productsSeeder');
const pool = require('../config');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function runSeeders() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'sg_prime_db';
    console.log(`📦 Checking database: ${dbName}...`);

    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
    });

    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log('✅ Database ready\n');
    await tempConnection.end();

    // Test database connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection established\n');
    connection.release();

    // Run seeders in order
    await seedCategories();
    await seedProducts();

    console.log('\n🎉 All seeders completed successfully!');

    // Display summary
    const [categoryCount] = await pool.execute('SELECT COUNT(*) as count FROM categories');
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');

    console.log('\n📊 Database Summary:');
    console.log(`   - Categories: ${categoryCount[0].count}`);
    console.log(`   - Products: ${productCount[0].count}`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

module.exports = runSeeders;
