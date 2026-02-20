const bcrypt = require('bcryptjs');
const pool = require('../config');

async function seedAdmin() {
  console.log('👤 Seeding admin user...');

  try {
    // Check if admin already exists
    const [existing] = await pool.execute('SELECT id FROM admins WHERE username = ?', ['admin']);

    if (existing.length > 0) {
      console.log('   ⚠️  Admin user already exists, skipping.\n');
      return;
    }

    // Hash the default password
    const passwordHash = await bcrypt.hash('admin123', 12);

    await pool.execute(
      `INSERT INTO admins (username, password_hash, email, role, is_active)
       VALUES (?, ?, ?, 'admin', TRUE)`,
      ['admin', passwordHash, 'admin@sgprimeenterprises.com'],
    );

    console.log('   ✅ Admin user created');
    console.log('   📋 Username : admin');
    console.log('   📋 Password : admin123  ← Change this after first login!\n');
  } catch (error) {
    console.error('   ❌ Failed to seed admin:', error.message);
    throw error;
  }
}

module.exports = seedAdmin;
