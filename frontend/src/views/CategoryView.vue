<script setup>
import api from '@/services/api';
import ProductCard from '@/components/ProductCard.vue';
import { onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const category = ref(null);
const products = ref([]);
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const [catRes, productsRes] = await Promise.all([
      api.get(`/categories/${route.params.slug}`),
      api.get(`/products?category=${route.params.slug}&status=active`),
    ]);

    if (catRes.data.success) {
      category.value = catRes.data.data;
    } else {
      router.push('/products');
      return;
    }

    if (productsRes.data.success) {
      products.value = productsRes.data.data;
    }
  } catch {
    router.push('/products');
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.slug, fetchData);
onMounted(fetchData);
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="min-h-96 flex items-center justify-center bg-cream">
    <div class="flex flex-col items-center gap-3 text-bark-400">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
      <p class="text-sm">Loading category…</p>
    </div>
  </div>

  <div v-else-if="category">
    <!-- Hero -->
    <section class="relative py-20 bg-bark-800 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="w-full h-full bg-gradient-to-br from-earth-400 to-coir-600"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-white/60 mb-6">
          <RouterLink to="/" class="hover:text-white transition-colors">Home</RouterLink>
          <i class="pi pi-angle-right text-xs"></i>
          <RouterLink to="/products" class="hover:text-white transition-colors">Products</RouterLink>
          <i class="pi pi-angle-right text-xs"></i>
          <span class="text-white/90">{{ category.name }}</span>
        </nav>

        <span class="badge bg-earth-500/20 text-earth-300 mb-4">Category</span>
        <h1 class="font-display font-bold text-white text-4xl md:text-5xl mb-4">
          {{ category.name }}
        </h1>
        <p v-if="category.description" class="text-coir-300 text-lg max-w-2xl">
          {{ category.description }}
        </p>
        <p class="text-white/40 text-sm mt-4">
          {{ products.length }} product{{ products.length !== 1 ? 's' : '' }} available
        </p>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-14 bg-cream">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Empty state -->
        <div v-if="products.length === 0" class="text-center py-20">
          <i class="pi pi-inbox text-coir-300 text-6xl mb-4"></i>
          <h3 class="font-display text-bark-700 text-xl mb-2">No products in this category yet</h3>
          <p class="text-bark-400 mb-6">Check back soon or explore our other products.</p>
          <RouterLink to="/products" class="btn-primary">View All Products</RouterLink>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>
    </section>
  </div>
</template>
