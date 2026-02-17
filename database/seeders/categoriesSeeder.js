const pool = require('../config');

const categoriesData = [
  {
    name: 'Erosion Control',
    slug: 'erosion-control',
    description:
      'Engineered solutions for soil erosion, riverbanks, slopes, and construction areas.',
  },
  {
    name: 'Greenhouse Products',
    slug: 'greenhouse',
    description: 'Coir-based growing media for controlled environments.',
  },
  {
    name: 'Indoor and Outdoor Gardening',
    slug: 'gardening',
    description: 'Sustainable coir products for home and professional growers.',
  },
];

async function seedCategories() {
  const connection = await pool.getConnection();

  try {
    console.log('🌱 Seeding categories...');

    for (const category of categoriesData) {
      await connection.execute(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)',
        [category.name, category.slug, category.description],
      );
    }

    console.log('✅ Categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = seedCategories;
