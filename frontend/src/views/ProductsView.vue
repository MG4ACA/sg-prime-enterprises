<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';

const products = ref([]);
const allCategories = ref([{ name: 'All', slug: null }]);
const activeCategory = ref(null); // null = All, otherwise category slug
const featuredOnly = ref(false);
const loading = ref(true);

const categoryIcon = (slug) => {
  const icons = {
    'erosion-control': 'pi pi-chart-line',
    'greenhouse-products': 'pi pi-sun',
    'gardening-products': 'pi pi-leaf',
  };
  return icons[slug] || 'pi pi-tag';
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data.success) {
      allCategories.value = [{ name: 'All', slug: null }, ...res.data.data];
    }
  } catch (e) {
    console.error('Failed to fetch categories:', e);
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams({ status: 'active' });
    if (activeCategory.value) params.set('category', activeCategory.value);
    if (featuredOnly.value) params.set('featured', 'true');

    const res = await api.get(`/products?${params}`);
    if (res.data.success) products.value = res.data.data;
  } catch (e) {
    console.error('Failed to fetch products:', e);
  } finally {
    loading.value = false;
  }
};

const selectCategory = (slug) => {
  activeCategory.value = slug;
  fetchProducts();
};

const toggleFeatured = () => {
  featuredOnly.value = !featuredOnly.value;
  fetchProducts();
};

onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});
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
          :key="cat.slug"
          @click="selectCategory(cat.slug)"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0"
          :class="
            activeCategory === cat.slug
              ? 'bg-earth-500 text-white shadow-md'
              : 'bg-coir-100 text-bark-600 hover:bg-earth-50 hover:text-earth-700'
          "
        >
          <i :class="cat.slug ? categoryIcon(cat.slug) : 'pi pi-th-large'" class="text-xs"></i>
          {{ cat.name }}
        </button>

        <!-- Featured toggle -->
        <button
          @click="toggleFeatured"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ml-auto"
          :class="
            featuredOnly
              ? 'bg-coir-500 text-white shadow-md'
              : 'bg-coir-100 text-bark-600 hover:bg-coir-200 hover:text-bark-800'
          "
        >
          <i class="pi pi-star-fill text-xs"></i>
          Featured Only
        </button>
      </div>
    </div>
  </section>

  <!-- Product Grid -->
  <section class="pb-24 bg-cream pt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-24 gap-3 text-bark-400"
      >
        <i class="pi pi-spin pi-spinner text-4xl"></i>
        <p class="text-sm">Loading products…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="products.length === 0" class="text-center py-24">
        <i class="pi pi-inbox text-5xl text-bark-300 mb-4 block"></i>
        <h3 class="font-display font-semibold text-bark-700 text-xl mb-2">No products found</h3>
        <p class="text-bark-400 text-sm">Try adjusting your filters.</p>
      </div>

      <!-- Grid -->
      <Transition v-else name="fade" mode="out-in">
        <div :key="`${activeCategory}-${featuredOnly}`">
          <div class="flex items-center justify-between mb-6">
            <p class="text-bark-500 text-sm">
              Showing
              <span class="font-semibold text-bark-800">{{ products.length }}</span>
              product{{ products.length !== 1 ? 's' : '' }}
              <span v-if="featuredOnly" class="ml-1 text-coir-500 font-medium">(featured)</span>
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
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
