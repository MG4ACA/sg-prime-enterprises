<script setup>
import { computed, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { categories, products } from '../data/products.js';

const activeCategory = ref('All');

const allCategories = ['All', ...categories];

const filteredProducts = computed(() =>
  activeCategory.value === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory.value),
);

const categoryIcons = {
  All: 'pi pi-th-large',
  'Erosion Control': 'pi pi-chart-line',
  'Greenhouse Products': 'pi pi-sun',
  'Gardening Products': 'pi pi-leaf',
};

const categoryDescriptions = {
  All: 'Browse our complete range of premium coir products.',
  'Erosion Control': 'Natural fiber solutions to protect soil, slopes, and waterways from erosion.',
  'Greenhouse Products':
    'Biodegradable growing containers and media for professional horticulture.',
  'Gardening Products':
    'Sustainable coir growing media, mulch, and accessories for home and commercial gardens.',
};
</script>

<template>
  <!-- Page Header -->
  <section class="relative py-20 overflow-hidden bg-bark-800">
    <img
      src="https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1400&q=80"
      alt="Coir products"
      class="absolute inset-0 w-full h-full object-cover opacity-20"
    />
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="badge bg-earth-500/20 text-earth-400 mb-4">Product Catalogue</span>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-5">Our Coir Products</h1>
      <p class="text-coir-300 text-lg max-w-2xl mx-auto">
        Sustainably manufactured coir products across three specialist categories — each designed to
        perform in harmony with nature.
      </p>
    </div>
  </section>

  <!-- Category Filter -->
  <section
    class="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-tan shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        <button
          v-for="cat in allCategories"
          :key="cat"
          @click="activeCategory = cat"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
          :class="
            activeCategory === cat
              ? 'bg-earth-500 text-white shadow-md'
              : 'bg-coir-100 text-bark-600 hover:bg-earth-50 hover:text-earth-700'
          "
        >
          <i :class="categoryIcons[cat]" class="text-xs"></i>
          {{ cat }}
        </button>
      </div>
    </div>
  </section>

  <!-- Category Description -->
  <section class="py-10 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Transition name="fade" mode="out-in">
        <div
          :key="activeCategory"
          class="flex items-start gap-4 bg-earth-50 border border-earth-200 rounded-2xl p-5 max-w-2xl"
        >
          <i
            :class="categoryIcons[activeCategory]"
            class="text-earth-500 text-2xl mt-0.5 shrink-0"
          ></i>
          <div>
            <h2 class="font-display font-semibold text-bark-800 text-lg">{{ activeCategory }}</h2>
            <p class="text-bark-500 text-sm mt-1">{{ categoryDescriptions[activeCategory] }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </section>

  <!-- Product Grid -->
  <section class="pb-24 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Transition name="fade" mode="out-in">
        <div :key="activeCategory">
          <div class="flex items-center justify-between mb-6">
            <p class="text-bark-500 text-sm">
              Showing
              <span class="font-semibold text-bark-800">{{ filteredProducts.length }}</span>
              product{{ filteredProducts.length !== 1 ? 's' : '' }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
          </div>
        </div>
      </Transition>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="bg-earth-500 py-14">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-display font-bold text-white mb-4">Need a Custom Order?</h2>
      <p class="text-earth-100 text-lg mb-8">
        We manufacture to specification — custom sizes, blends, and packaging available for bulk
        orders.
      </p>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 px-8 py-3 bg-white text-earth-600 font-semibold rounded-lg hover:bg-earth-50 transition-colors shadow-md"
      >
        Talk to Our Team
        <i class="pi pi-arrow-right text-sm"></i>
      </a>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
