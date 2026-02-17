const pool = require('../config');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function resetDatabase() {
  console.log('⚠️  WARNING: This will delete ALL data from your database!');
  console.log('Tables affected: categories, products, enquiries\n');
  
  const confirmation = await askQuestion('Are you sure you want to continue? (yes/no): ');
  
  if (confirmation.toLowerCase() !== 'yes') {
    console.log('❌ Reset cancelled');
    rl.close();
    process.exit(0);
  }
  
  const connection = await pool.getConnection();
  
  try {
    console.log('\n🗑️  Clearing database...');
    
    // Disable foreign key checks temporarily
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate tables in reverse order of dependencies
    await connection.execute('TRUNCATE TABLE enquiries');
    console.log('   ✓ Cleared enquiries');
    
    await connection.execute('TRUNCATE TABLE products');
    console.log('   ✓ Cleared products');
    
    await connection.execute('TRUNCATE TABLE categories');
    console.log('   ✓ Cleared categories');
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\n✅ Database reset complete!');
    console.log('\n💡 Run "npm run seed" to populate with fresh data');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
    rl.close();
  }
}

// Run reset if this file is executed directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
