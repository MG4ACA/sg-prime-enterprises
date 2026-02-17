const pool = require('../config');

const productsData = [
  {
    name: 'Coir Geo Textile',
    category_slug: 'erosion-control',
    description: '100% natural coconut coir fiber yarn woven to various sizes ideal for soil stabilization. Eco-friendly, biodegradable, and easy to install.',
    specifications: {
      'Weight': '400gsm / 700gsm / 900gsm (customizable)',
      'Dimensions': '1m – 4m width, up to 50m length',
      'Material': '100% natural coir fiber'
    },
    is_featured: true,
    display_order: 1
  },
  {
    name: 'Coir Geotextile Bale',
    category_slug: 'erosion-control',
    description: '100% natural knitted coir yarn tightly compressed to bales. Protects riverbanks and shorelines from high water currents.',
    specifications: {
      'Dimensions': '2m x 50m',
      'Weight': '125 kg – 140 kg'
    },
    is_featured: false,
    display_order: 2
  },
  {
    name: 'Coir Logs / Water Logs',
    category_slug: 'erosion-control',
    description: 'Cylindrical structures made of coir fiber encased in coir netting. Ideal for shoreline protection and sediment control.',
    specifications: {
      'Diameter': 'Standard 30cm (customizable)',
      'Length': 'Standard 3m (customizable)'
    },
    is_featured: true,
    display_order: 3
  },
  {
    name: 'Coir Stitched Blanket',
    category_slug: 'erosion-control',
    description: 'Middle Coir fiber with outside PP / Jute netting. Used as a blanket on slopes and hills to counteract soil erosion.',
    specifications: {
      'Length': '10m to 50m',
      'Width': '1m to 2m',
      'Material': 'Coir fiber with PP/Jute netting'
    },
    is_featured: false,
    display_order: 4
  },
  {
    name: 'Open Top Bag',
    category_slug: 'greenhouse',
    description: 'Coco peat and chip combination depending on plant type. Compressed blocks with integrated drainage holes. UV-treated plastic bag.',
    specifications: {
      'Features': 'Pre-filled, Reusable, Integrated drainage',
      'Usage': 'Hydroponic vegetable and fruit cultivation'
    },
    is_featured: true,
    display_order: 5
  },
  {
    name: 'Grow Cubes',
    category_slug: 'greenhouse',
    description: 'Compressed coir cubes for seed propagation and young plants.',
    specifications: {
      'Material': '100% Coir pith'
    },
    is_featured: false,
    display_order: 6
  },
  {
    name: 'Starter Plugs',
    category_slug: 'greenhouse',
    description: 'Small coir plugs designed for seamless transplanting and root development.',
    specifications: {
      'Usage': 'Seed starting, cloning'
    },
    is_featured: false,
    display_order: 7
  }
];

async function seedProducts() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Seeding products...');
    
    // Get category IDs
    const [categories] = await connection.execute('SELECT id, slug FROM categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    for (const product of productsData) {
      const categoryId = categoryMap[product.category_slug];
      
      if (!categoryId) {
        console.warn(`⚠️  Category "${product.category_slug}" not found for product "${product.name}"`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO products (name, category_id, description, specs, is_featured, display_order, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'active')
         ON DUPLICATE KEY UPDATE 
         description = VALUES(description), 
         specs = VALUES(specs),
         is_featured = VALUES(is_featured),
         display_order = VALUES(display_order)`,
        [
          product.name,
          categoryId,
          product.description,
          JSON.stringify(product.specifications),
          product.is_featured ? 1 : 0,
          product.display_order
        ]
      );
    }
    
    console.log('✅ Products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = seedProducts;
