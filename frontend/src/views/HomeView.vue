<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';

const featuredProducts = ref([]);

const slides = ref([
  {
    id: 1,
    tag: 'Erosion Control',
    title: 'Protect the Earth,\nNaturally.',
    description:
      'Our premium coir erosion blankets and wattles safeguard slopes, riverbanks, and embankments — biodegrading gently once vegetation takes hold.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80',
    cta: { label: 'Explore Erosion Products', to: '/products' },
    accent: 'bg-earth-500',
  },
  {
    id: 2,
    tag: 'Greenhouse Products',
    title: 'Grow Greener\nWith Coir.',
    description:
      'From biodegradable pots to high-performance grow bags, our greenhouse range gives your plants the best natural start — without the plastic.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    cta: { label: 'View Greenhouse Range', to: '/products' },
    accent: 'bg-coir-600',
  },
  {
    id: 3,
    tag: 'Gardening Products',
    title: "Your Garden's\nNatural Ally.",
    description:
      'Coir peat, mulch discs, and handcrafted mats — everything you need for a thriving, sustainable garden crafted from 100% natural coconut fiber.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80',
    cta: { label: 'Shop Garden Products', to: '/products' },
    accent: 'bg-bark-700',
  },
]);

const whyUs = ref([
  {
    icon: 'pi pi-leaf',
    title: '100% Natural',
    desc: 'Every product is made from natural coconut husk fiber — renewable, biodegradable, and sustainably sourced from certified farms.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Certified Quality',
    desc: 'ISO 9001-certified manufacturing processes ensure consistent quality, durability, and performance across our entire product range.',
  },
  {
    icon: 'pi pi-globe',
    title: 'Global Reach',
    desc: 'We export premium coir products to over 30 countries, with reliable logistics and dedicated customer service worldwide.',
  },
  {
    icon: 'pi pi-cog',
    title: 'Custom Solutions',
    desc: 'Need a specific size, thickness, or blend? Our team works with you to create bespoke coir products for your project requirements.',
  },
]);

onMounted(async () => {
  try {
    const res = await api.get('/products?status=active&featured=true');
    if (res.data.success) featuredProducts.value = res.data.data.slice(0, 6);
  } catch (e) {
    console.error('Failed to load featured products:', e);
  }
});
</script>

<template>
  <!-- ── Hero Carousel ─────────────────────────────────────── -->
  <section class="relative h-screen min-h-[600px] w-screen overflow-hidden">
    <PCarousel
      :value="slides"
      :numVisible="1"
      :numScroll="1"
      :autoplayInterval="5000"
      circular
      class="w-full h-full overflow-hidden"
    >
      <template #item="{ data: slide }">
        <div class="relative h-screen min-h-[600px] w-screen overflow-hidden">
          <!-- Background image -->
          <img
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
          ></div>

          <!-- Content -->
          <div class="relative h-full flex items-center">
            <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
              <div class="max-w-xl">
                <span
                  class="badge text-white mb-5 inline-flex items-center gap-2"
                  :class="slide.accent + '/90'"
                >
                  <i class="pi pi-leaf text-xs"></i>
                  {{ slide.tag }}
                </span>
                <h1
                  class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5 whitespace-pre-line"
                >
                  {{ slide.title }}
                </h1>
                <p class="text-white/85 text-lg leading-relaxed mb-8 max-w-md">
                  {{ slide.description }}
                </p>
                <div class="flex flex-wrap gap-4">
                  <RouterLink :to="slide.cta.to" class="btn-primary">
                    {{ slide.cta.label }}
                    <i class="pi pi-arrow-right ml-2 text-xs"></i>
                  </RouterLink>
                  <RouterLink
                    to="/about"
                    class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                  >
                    Our Story
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </PCarousel>
  </section>

  <!-- ── Featured Products ────────────────────────────────── -->
  <section class="py-20 px-4 sm:px-6 lg:px-8 bg-cream max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <span class="badge bg-earth-100 text-earth-600 mb-4">Our Products</span>
      <h2 class="section-title">Featured Coir Products</h2>
      <p class="section-subtitle max-w-2xl mx-auto">
        Handpicked essentials from our three product categories — each crafted from premium coconut
        husk fiber.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
    </div>

    <div class="text-center mt-12">
      <RouterLink to="/products" class="btn-primary">
        View All Products
        <i class="pi pi-arrow-right ml-2 text-xs"></i>
      </RouterLink>
    </div>
  </section>

  <!-- ── Why Choose Us ────────────────────────────────────── -->
  <section class="py-20 bg-bark-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <span class="badge bg-earth-500/20 text-earth-400 mb-4">Why SG Prime</span>
        <h2 class="text-3xl md:text-4xl font-display font-bold text-white mb-3">
          Nature-First Manufacturing
        </h2>
        <p class="text-coir-300 text-lg max-w-2xl mx-auto">
          A commitment to quality, sustainability, and innovation since 2009.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="item in whyUs"
          :key="item.title"
          class="bg-bark-700/50 rounded-2xl p-7 border border-bark-600 hover:border-earth-500/50 transition-colors group"
        >
          <div
            class="w-12 h-12 rounded-xl bg-earth-500/20 flex items-center justify-center mb-5 group-hover:bg-earth-500/30 transition-colors"
          >
            <i :class="item.icon" class="text-earth-400 text-xl"></i>
          </div>
          <h3 class="font-display font-semibold text-white text-lg mb-3">{{ item.title }}</h3>
          <p class="text-coir-300 text-sm leading-relaxed">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── Call to Action ───────────────────────────────────── -->
  <section class="relative py-24 overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=80"
      alt="Natural landscape"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-bark-800/75"></div>
    <div class="relative max-w-3xl mx-auto px-4 text-center">
      <i class="pi pi-leaf text-4xl text-earth-400 mb-5 block"></i>
      <h2 class="text-3xl md:text-5xl font-display font-bold text-white mb-5">
        Ready to Go Natural?
      </h2>
      <p class="text-coir-200 text-lg mb-10">
        Get in touch with our team for product samples, bulk pricing, and custom manufacturing.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink to="/contact" class="btn-primary">
          Request a Quote
          <i class="pi pi-envelope ml-2 text-xs"></i>
        </RouterLink>
        <RouterLink
          to="/products"
          class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/60 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
        >
          Browse Catalogue
        </RouterLink>
      </div>
    </div>
  </section>
</template>
