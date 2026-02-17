<template>
  <div class="home-page">
    <NavBar />
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background" ref="heroBg"></div>
      <div class="container">
        <div class="hero-content">
          <!-- Left Side - Text -->
          <div class="hero-left" ref="heroLeft">
            <h1 class="hero-title">
              Nature Distilled<br>
              <span class="accent">Into Excellence</span>
            </h1>
            <p class="hero-subtitle">
              Industrial coir products engineered for sustainability. 
              From erosion control to greenhouse solutions, we bring 
              nature's strength to modern applications.
            </p>
            <div class="hero-buttons">
              <Button 
                label="Explore Products" 
                class="btn-primary btn-large"
                @click="$router.push('/products')"
              />
              <Button 
                label="Get in Touch" 
                class="btn-secondary btn-large"
                @click="$router.push('/contact')"
              />
            </div>
          </div>

          <!-- Right Side - Product Image with Parallax -->
          <div class="hero-right" ref="heroRight">
            <div class="hero-image-wrapper" ref="heroImage">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" 
                alt="Premium Coir Products"
                class="hero-img"
              />
              <div class="hero-badge">
                <span class="badge-text">100%</span>
                <span class="badge-sub">Natural</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator" ref="scrollIndicator">
        <span>Scroll to explore</span>
        <i class="pi pi-arrow-down"></i>
      </div>
    </section>

    <!-- Featured Categories Section -->
    <section class="categories-section" ref="categoriesSection">
      <div class="container">
        <div class="section-header" ref="sectionHeader">
          <h2>Our Product Categories</h2>
          <p>Sustainable solutions for every industrial need</p>
        </div>

        <div class="categories-grid" ref="categoriesGrid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            @click="$router.push(`/category/${category.slug}`)"
          >
            <div class="category-icon">
              <i :class="getCategoryIcon(category.slug)"></i>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
            <span class="category-link">
              Explore <i class="pi pi-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products" ref="featuredSection">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Our most popular industrial coir solutions</p>
        </div>

        <div class="products-grid" ref="productsGrid">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id"
            class="product-card"
            @click="$router.push(`/products/${product.id}`)"
          >
            <div class="product-image">
              <img 
                :src="product.image_url || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'" 
                :alt="product.name"
              />
              <div class="product-badge">Featured</div>
            </div>
            <div class="product-info">
              <span class="product-category">{{ product.category_name }}</span>
              <h3>{{ product.name }}</h3>
              <p>{{ truncateText(product.description, 100) }}</p>
              <span class="product-link">
                View Details <i class="pi pi-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="view-all-wrapper">
          <Button 
            label="View All Products" 
            class="btn-secondary"
            @click="$router.push('/products')"
          />
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-us" ref="whyUsSection">
      <div class="container">
        <div class="section-header">
          <h2>Why Choose SG Prime?</h2>
          <p>Leading the industry with quality and sustainability</p>
        </div>

        <div class="features-grid" ref="featuresGrid">
          <div class="feature-item">
            <div class="feature-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <h3>100% Natural</h3>
            <p>All our coir products are made from natural, sustainable coconut fibers</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="pi pi-shield"></i>
            </div>
            <h3>Quality Assured</h3>
            <p>Rigorous testing and quality control ensures superior products</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="pi pi-globe"></i>
            </div>
            <h3>Global Reach</h3>
            <p>Serving industrial clients worldwide with reliable logistics</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="pi pi-users"></i>
            </div>
            <h3>Expert Support</h3>
            <p>Dedicated team to assist with product selection and technical queries</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" ref="ctaSection">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today for pricing, samples, or technical consultations</p>
          <Button 
            label="Request a Quote" 
            class="btn-primary btn-large"
            @click="$router.push('/contact')"
          />
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

// Refs for GSAP animations
const heroBg = ref(null)
const heroLeft = ref(null)
const heroRight = ref(null)
const heroImage = ref(null)
const scrollIndicator = ref(null)
const categoriesSection = ref(null)
const sectionHeader = ref(null)
const categoriesGrid = ref(null)
const featuredSection = ref(null)
const productsGrid = ref(null)
const whyUsSection = ref(null)
const featuresGrid = ref(null)
const ctaSection = ref(null)

// Data
const categories = ref([])
const featuredProducts = ref([])

// GSAP instance
const { fadeIn, staggerIn, parallax, gsap, ScrollTrigger } = useGSAP()

// Fetch data
const fetchData = async () => {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?featured=true')
    ])

    if (categoriesRes.data.success) {
      categories.value = categoriesRes.data.data
    }

    if (productsRes.data.success) {
      featuredProducts.value = productsRes.data.data
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

// Utility functions
const getCategoryIcon = (slug) => {
  const icons = {
    'erosion-control': 'pi pi-shield',
    'greenhouse': 'pi pi-sun',
    'gardening': 'pi pi-star'
  }
  return icons[slug] || 'pi pi-box'
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Initialize animations
const initAnimations = () => {
  // Hero animations
  gsap.from(heroLeft.value, {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from(heroRight.value, {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  })

  // Parallax effect on hero image
  parallax(heroImage.value, {
    distance: -30,
    trigger: heroImage.value
  })

  // Scroll indicator animation
  gsap.to(scrollIndicator.value, {
    y: 10,
    repeat: -1,
    yoyo: true,
    duration: 1,
    ease: 'power1.inOut'
  })

  // Categories section - background transition
  gsap.to(categoriesSection.value, {
    backgroundColor: '#FFFFFF',
    scrollTrigger: {
      trigger: categoriesSection.value,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1
    }
  })

  // Stagger animation for category cards
  staggerIn('.category-card', {
    scrollTrigger: {
      trigger: categoriesGrid.value,
      start: 'top 80%'
    },
    stagger: 0.15
  })

  // Featured products animation
  staggerIn('.product-card', {
    scrollTrigger: {
      trigger: productsGrid.value,
      start: 'top 80%'
    },
    stagger: 0.12,
    y: 60
  })

  // Features grid animation
  staggerIn('.feature-item', {
    scrollTrigger: {
      trigger: featuresGrid.value,
      start: 'top 80%'
    },
    stagger: 0.1
  })

  // CTA section fade in
  fadeIn(ctaSection.value.querySelector('.cta-content'), {
    scrollTrigger: {
      trigger: ctaSection.value,
      start: 'top 70%'
    },
    y: 40,
    duration: 0.8
  })
}

onMounted(async () => {
  await fetchData()
  // Wait for DOM to be fully ready
  setTimeout(() => {
    initAnimations()
  }, 100)
})
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-canvas) 0%, #FAE5D3 100%);
  z-index: -1;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-title .accent {
  color: var(--color-secondary);
  display: block;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-text);
  opacity: 0.85;
  margin-bottom: 2rem;
  max-width: 540px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
}

.hero-image-wrapper {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.hero-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.hero-image-wrapper:hover .hero-img {
  transform: scale(1.05);
}

.hero-badge {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background-color: var(--color-brand);
  color: white;
  padding: 1.5rem;
  border-radius: 50%;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.badge-text {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.badge-sub {
  display: block;
  font-size: 0.875rem;
  opacity: 0.9;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-brand);
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Sections */
section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  margin-bottom: 1rem;
}

.section-header p {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.75;
  max-width: 600px;
  margin: 0 auto;
}

/* Categories Section */
.categories-section {
  background-color: var(--color-canvas);
  transition: background-color 0.6s ease;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.category-card {
  background-color: white;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-medium);
  box-shadow: var(--shadow-sm);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.category-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon i {
  font-size: 2rem;
  color: white;
}

.category-card h3 {
  margin-bottom: 1rem;
}

.category-card p {
  color: var(--color-text);
  opacity: 0.75;
  margin-bottom: 1.5rem;
}

.category-link {
  color: var(--color-brand);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Featured Products */
.featured-products {
  background-color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
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

.product-link {
  color: var(--color-brand);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all-wrapper {
  text-align: center;
}

/* Why Us Section */
.why-us {
  background: linear-gradient(135deg, var(--color-canvas) 0%, white 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background-color: var(--color-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.feature-icon i {
  font-size: 1.75rem;
  color: white;
}

.feature-item h3 {
  margin-bottom: 1rem;
}

.feature-item p {
  color: var(--color-text);
  opacity: 0.75;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  color: white;
  text-align: center;
  padding: 5rem 0;
}

.cta-content h2 {
  color: white;
  margin-bottom: 1rem;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.cta-section .btn-primary {
  background-color: white;
  color: var(--color-brand);
}

.cta-section .btn-primary:hover {
  background-color: var(--color-canvas);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero {
    min-height: auto;
    padding: 6rem 0 4rem;
  }

  .hero-right {
    order: -1;
  }

  .hero-buttons {
    justify-content: center;
  }

  .btn-large {
    flex: 1;
    min-width: 160px;
  }

  .categories-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    gap: 2rem;
  }
}
</style>
