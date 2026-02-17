<template>
  <div class="category-page">
    <NavBar />

    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
    </div>

    <div v-else-if="category">
      <section class="category-hero">
        <div class="container">
          <div class="breadcrumb">
            <router-link to="/">Home</router-link>
            <i class="pi pi-angle-right"></i>
            <span>{{ category.name }}</span>
          </div>
          <h1>{{ category.name }}</h1>
          <p>{{ category.description }}</p>
        </div>
      </section>

      <section class="products-section">
        <div class="container">
          <div v-if="products.length === 0" class="empty-state">
            <i class="pi pi-inbox"></i>
            <h3>No products in this category yet</h3>
            <Button
              label="View All Products"
              class="btn-primary"
              @click="$router.push('/products')"
            />
          </div>

          <div v-else class="products-grid">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
              @click="$router.push(`/products/${product.id}`)"
            >
              <div class="product-image">
                <img
                  :src="
                    product.image_url ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
                  "
                  :alt="product.name"
                />
                <div v-if="product.is_featured" class="product-badge">Featured</div>
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p>{{ truncateText(product.description, 120) }}</p>
                <span class="view-details">
                  View Details
                  <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const category = ref(null);
const products = ref([]);
const loading = ref(true);

const fetchCategoryData = async () => {
  try {
    const [categoryRes, productsRes] = await Promise.all([
      api.get(`/categories/${route.params.slug}`),
      api.get(`/products?category=${route.params.slug}&status=active`),
    ]);

    if (categoryRes.data.success) {
      category.value = categoryRes.data.data;
    }

    if (productsRes.data.success) {
      products.value = productsRes.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch category data:', error);
  } finally {
    loading.value = false;
  }
};

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

onMounted(() => {
  fetchCategoryData();
});
</script>

<style scoped>
.category-page {
  padding-top: 70px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.category-hero {
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  color: white;
  padding: 4rem 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: white;
  opacity: 0.9;
}

.breadcrumb i {
  opacity: 0.7;
  font-size: 0.75rem;
}

.breadcrumb span {
  opacity: 0.9;
}

.category-hero h1 {
  color: white;
  margin-bottom: 1rem;
}

.category-hero p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.125rem;
  max-width: 800px;
}

.products-section {
  padding: 4rem 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-medium);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(154, 90, 46, 0.1);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--color-brand);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.product-info p {
  color: var(--color-text);
  opacity: 0.75;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.view-details {
  color: var(--color-brand);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: var(--color-secondary);
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
