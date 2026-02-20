export const products = [
  // ── Erosion Control ──────────────────────────────────────
  {
    id: 1,
    name: 'Coir Erosion Blanket',
    category: 'Erosion Control',
    description:
      'A biodegradable mat woven from natural coir fiber that prevents soil erosion on slopes and embankments. Provides excellent temporary protection while vegetation establishes, then naturally decomposes into the soil.',
    image: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600&q=80',
    tags: ['Biodegradable', 'Slope Stabilization', 'UV Resistant'],
    featured: true,
  },
  {
    id: 2,
    name: 'Coir Wattle / Log',
    category: 'Erosion Control',
    description:
      'Cylindrical rolls tightly filled with coir fiber and wrapped in a coir mesh. Ideal for hillside slope stabilization, stream-bank protection, and roadside erosion management.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    tags: ['Stream Bank', 'Slope Stabilization', 'Durable'],
    featured: false,
  },
  {
    id: 3,
    name: 'Coir Mesh / Netting',
    category: 'Erosion Control',
    description:
      'Open-weave coir netting designed for hillside stabilization and promoting fast vegetation establishment. Available in multiple mesh sizes for different soil and slope conditions.',
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80',
    tags: ['Vegetation Support', 'Flexible', 'Eco-Friendly'],
    featured: true,
  },

  // ── Greenhouse Products ───────────────────────────────────
  {
    id: 4,
    name: 'Coir Growing Pots',
    category: 'Greenhouse Products',
    description:
      'Biodegradable pots compressed from natural coir fiber. Seeds and seedlings can be planted directly into the soil — pot and all — eliminating transplant shock and plastic waste.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    tags: ['Biodegradable', 'Seed Starting', 'Zero Waste'],
    featured: true,
  },
  {
    id: 5,
    name: 'Coir Hanging Baskets',
    category: 'Greenhouse Products',
    description:
      'Decorative hanging baskets lined with premium coir fiber. Natural insulation keeps roots cool, retains moisture, and provides excellent drainage for ornamental and edible plants.',
    image: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80',
    tags: ['Ornamental', 'Moisture Retention', 'Natural Liner'],
    featured: false,
  },
  {
    id: 6,
    name: 'Coir Grow Bags',
    category: 'Greenhouse Products',
    description:
      'Durable coir-filled grow bags ideal for tomatoes, cucumbers, peppers, and other high-value crops. Pre-buffered with balanced pH and enriched with natural nutrients for vigorous plant growth.',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80',
    tags: ['High-Value Crops', 'Pre-Buffered', 'Reusable'],
    featured: false,
  },

  // ── Gardening Products ────────────────────────────────────
  {
    id: 7,
    name: 'Coir Peat (Growing Medium)',
    category: 'Gardening Products',
    description:
      'Premium compressed coir fiber bricks that expand into a rich, sustainable growing medium. An eco-friendly peat moss alternative with excellent water retention, aeration, and natural resistance to fungus.',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&q=80',
    tags: ['Peat Alternative', 'Water Retention', 'Natural'],
    featured: true,
  },
  {
    id: 8,
    name: 'Coir Mulch Discs',
    category: 'Gardening Products',
    description:
      'Pre-cut circular discs placed around the base of trees and garden plants to retain moisture, suppress weeds, and regulate soil temperature. Breaks down slowly, enriching the soil over time.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
    tags: ['Mulching', 'Weed Suppression', 'Long-Lasting'],
    featured: false,
  },
  {
    id: 9,
    name: 'Coir Fibre Door Mat',
    category: 'Gardening Products',
    description:
      'Handcrafted door mats made from natural coir fiber. Highly durable, slip-resistant, and easy to clean — naturally hygienic and biodegradable at end of life.',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&q=80',
    tags: ['Handcrafted', 'Slip-Resistant', 'Durable'],
    featured: false,
  },
];

export const categories = ['Erosion Control', 'Greenhouse Products', 'Gardening Products'];

export const featuredProducts = products.filter((p) => p.featured);
