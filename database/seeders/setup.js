const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../backend/.env' });

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    const dbName = process.env.DB_NAME || 'sg_prime_db';

    // Step 1: Create database if it doesn't exist
    console.log(`📦 Step 1: Creating database "${dbName}"...`);
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    await tempConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log('✅ Database created/verified\n');

    // Step 2: Use the database
    await tempConnection.query(`USE \`${dbName}\``);

    // Step 3: Read and execute schema.sql
    console.log('📄 Step 2: Importing schema (creating tables)...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the entire schema file at once
    await tempConnection.query(schemaSql);

    console.log('✅ Tables created successfully\n');
    await tempConnection.end();

    // Step 4: Run seeders
    console.log('🌱 Step 3: Seeding data...\n');
    const runSeeders = require('./index');
    await runSeeders();

    console.log('\n🎉 Complete setup finished successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. cd ../backend && npm install');
    console.log('   2. npm run dev');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
