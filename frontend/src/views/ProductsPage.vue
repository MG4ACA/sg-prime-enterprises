<template>
  <div class="products-page">
    <NavBar />

    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="container">
        <h1>Our Products</h1>
        <p>Premium industrial coir solutions for every application</p>
      </div>
    </section>

    <!-- Filters & Products -->
    <section class="products-section">
      <div class="container">
        <!-- Filters -->
        <div class="filters-bar">
          <div class="filter-group">
            <label>Category:</label>
            <Dropdown 
              v-model="selectedCategory" 
              :options="filterCategories" 
              optionLabel="name"
              optionValue="slug"
              placeholder="All Categories"
              @change="fetchProducts"
            />
          </div>
          <div class="filter-group">
            <Button 
              :label="`${showFeaturedOnly ? 'Show All' : 'Featured Only'}`" 
              :class="showFeaturedOnly ? 'btn-primary' : 'btn-secondary'"
              @click="toggleFeatured"
            />
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="loading" class="loading-state">
          <div class="loading"></div>
          <p>Loading products...</p>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
        </div>

        <div v-else class="products-grid" ref="productsGrid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
            @click="viewProduct(product.id)"
          >
            <div class="product-image">
              <img 
                :src="product.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'" 
                :alt="product.name"
              />
              <div v-if="product.is_featured" class="product-badge">Featured</div>
            </div>
            <div class="product-info">
              <span class="product-category">{{ product.category_name }}</span>
              <h3>{{ product.name }}</h3>
              <p>{{ truncateText(product.description, 120) }}</p>
              <div class="product-footer">
                <span class="view-details">
                  View Details <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { useGSAP } from '@/composables/useGSAP'
import api from '@/services/api'

const router = useRouter()
const productsGrid = ref(null)

const products = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const showFeaturedOnly = ref(false)
const loading = ref(true)

const { staggerIn } = useGSAP()

const filterCategories = ref([
  { name: 'All Categories', slug: null }
])

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    if (response.data.success) {
      categories.value = response.data.data
      filterCategories.value = [
        { name: 'All Categories', slug: null },
        ...response.data.data
      ]
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    let url = '/products?status=active'
    
    if (selectedCategory.value) {
      url += `&category=${selectedCategory.value}`
    }
    
    if (showFeaturedOnly.value) {
      url += '&featured=true'
    }

    const response = await api.get(url)
    if (response.data.success) {
      products.value = response.data.data
      
      // Animate on load
      setTimeout(() => {
        if (productsGrid.value) {
          staggerIn('.product-card', {
            y: 40,
            stagger: 0.08
          })
        }
      }, 100)
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const toggleFeatured = () => {
  showFeaturedOnly.value = !showFeaturedOnly.value
  fetchProducts()
}

const viewProduct = (id) => {
  router.push(`/products/${id}`)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding-top: 70px;
}

.page-hero {
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
}

.page-hero h1 {
  color: white;
  margin-bottom: 1rem;
}

.page-hero p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
}

.products-section {
  padding: 2rem 0 4rem;
}

.filters-bar {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--color-text);
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

.product-category {
  display: inline-block;
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-details {
  color: var(--color-brand);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-state,
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
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
    justify-content: space-between;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
