<template>
  <div class="home-page">
    <NavBar />

    <!-- Hero Section - Full Width Image with Wave -->
    <section class="hero" ref="heroSection">
      <div class="hero-image-container" ref="heroBg">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80"
          alt="Sustainable coir manufacturing"
          class="hero-bg-img"
        />
        <div class="hero-overlay"></div>
      </div>
      <!-- Wave SVG Divider -->
      <div class="hero-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,70 L1440,120 L0,120 Z"
            fill="#F5F0E8"
          />
        </svg>
      </div>
    </section>

    <!-- Hero Text Section -->
    <section class="hero-text-section">
      <div class="container">
        <div class="hero-text-content" ref="heroText">
          <h1 class="hero-title">
            <span class="hero-title-company">SG PRIME ENTERPRISES</span>
            <span class="hero-title-main">
              ENGINEERING A SUSTAINABLE
              <br />
              FUTURE WITH COIR.
            </span>
          </h1>
        </div>
      </div>
    </section>

    <!-- Featured Products Section - 3 Column Grid -->
    <section class="featured-products" ref="featuredSection">
      <div class="container">
        <div class="products-grid" ref="productsGrid">
          <div
            v-for="product in allProducts"
            :key="product.id"
            class="product-card"
            @click="$router.push(`/products/${product.id}`)"
          >
            <div class="product-image">
              <img
                :src="
                  product.image_url ||
                  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
                "
                :alt="product.name"
              />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>{{ truncateText(product.description, 80) }}</p>
              <button
                class="btn-view-details"
                @click.stop="$router.push(`/products/${product.id}`)"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        </div>

        <div class="view-all-wrapper" v-if="allProducts.length > 0">
          <button class="btn-view-all" @click="$router.push('/products')">
            View All Products
            <i class="pi pi-arrow-right"></i>
          </button>
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
          <button class="btn-cta" @click="$router.push('/contact')">Request a Quote</button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
import { useGSAP } from '@/composables/useGSAP';
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Refs for GSAP animations
const heroSection = ref(null);
const heroBg = ref(null);
const heroText = ref(null);
const featuredSection = ref(null);
const productsGrid = ref(null);
const whyUsSection = ref(null);
const featuresGrid = ref(null);
const ctaSection = ref(null);

// Data
const allProducts = ref([]);

// GSAP instance
const { fadeIn, staggerIn, parallax, gsap, ScrollTrigger } = useGSAP();

// Fetch data
const fetchData = async () => {
  try {
    const productsRes = await api.get('/products');
    if (productsRes.data.success) {
      allProducts.value = productsRes.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

// Utility functions
const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Initialize animations
const initAnimations = () => {
  // Hero parallax on background image
  if (heroBg.value) {
    gsap.to(heroBg.value.querySelector('.hero-bg-img'), {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Hero text fade in
  if (heroText.value) {
    gsap.from(heroText.value, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heroText.value,
        start: 'top 90%',
      },
    });
  }

  // Stagger animation for product cards
  staggerIn('.product-card', {
    scrollTrigger: {
      trigger: productsGrid.value,
      start: 'top 85%',
    },
    stagger: 0.1,
    y: 40,
  });

  // Features grid animation
  staggerIn('.feature-item', {
    scrollTrigger: {
      trigger: featuresGrid.value,
      start: 'top 80%',
    },
    stagger: 0.1,
  });

  // CTA section fade in
  if (ctaSection.value) {
    fadeIn(ctaSection.value.querySelector('.cta-content'), {
      scrollTrigger: {
        trigger: ctaSection.value,
        start: 'top 70%',
      },
      y: 40,
      duration: 0.8,
    });
  }
};

onMounted(async () => {
  await fetchData();
  setTimeout(() => {
    initAnimations();
  }, 100);
});
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* ===== HERO SECTION ===== */
.hero {
  position: relative;
  height: 55vh;
  min-height: 350px;
  max-height: 550px;
  overflow: hidden;
  padding: 0;
}

.hero-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-bg-img {
  width: 100%;
  height: 120%;
  object-fit: cover;
  object-position: center 40%;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 60%,
    rgba(245, 240, 232, 0.3) 100%
  );
}

.hero-wave {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  z-index: 2;
}

.hero-wave svg {
  display: block;
  width: 100%;
  height: 80px;
}

/* ===== HERO TEXT SECTION ===== */
.hero-text-section {
  background-color: var(--color-canvas);
  padding: 3rem 0 4rem;
}

.hero-text-content {
  max-width: 900px;
}

.hero-title {
  line-height: 1.15;
  margin-bottom: 0;
}

.hero-title-company {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  color: var(--color-brand);
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.hero-title-main {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-brand);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

/* ===== PRODUCTS GRID ===== */
.featured-products {
  background-color: var(--color-canvas);
  padding: 0 0 5rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.product-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.25rem;
  gap: 1rem;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  min-width: 100px;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-cream);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h3 {
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.35rem;
  line-height: 1.3;
}

.product-info p {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  opacity: 1;
}

.btn-view-details {
  display: inline-block;
  background: transparent;
  border: 1.5px solid var(--color-brand);
  color: var(--color-brand);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-details:hover {
  background-color: var(--color-brand);
  color: white;
}

.view-all-wrapper {
  text-align: center;
}

.btn-view-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background-color: var(--color-brand);
  color: white;
}

/* ===== SECTIONS GENERAL ===== */
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

/* ===== WHY US SECTION ===== */
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

/* ===== CTA SECTION ===== */
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

.btn-cta {
  display: inline-block;
  background-color: white;
  color: var(--color-brand);
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cta:hover {
  background-color: var(--color-canvas);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 40vh;
    min-height: 250px;
  }

  .hero-text-section {
    padding: 2rem 0 3rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-card {
    padding: 1rem;
  }

  .product-image {
    width: 80px;
    height: 80px;
    min-width: 80px;
  }

  .features-grid {
    gap: 2rem;
  }
}
</style>
