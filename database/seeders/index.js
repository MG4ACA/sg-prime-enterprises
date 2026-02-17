const seedCategories = require('./categoriesSeeder');
const seedProducts = require('./productsSeeder');
const pool = require('../config');

async function runSeeders() {
  console.log('🚀 Starting database seeding...\n');
  
  try {
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
