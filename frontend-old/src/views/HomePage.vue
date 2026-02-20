<template>
  <div class="home-page">
    <NavBar />

    <!-- Hero Section - Bento Grid -->
    <section class="hero" ref="heroSection">
      <!-- Animated gradient background -->
      <div class="hero-gradient"></div>
      <div class="hero-grain"></div>

      <div class="hero-container">
        <div class="bento-grid">
          <!-- Main Title Card -->
          <div class="bento-main" ref="bentoMain">
            <div class="bento-main-inner">
              <span class="hero-badge-tag">🌿 Sustainable Coir Solutions</span>
              <h1 class="hero-title">
                Nature
                <br />
                Distilled Into
                <br />
                <span class="title-accent">Excellence.</span>
              </h1>
              <p class="hero-subtitle">
                Industrial coir products engineered for a greener tomorrow. From erosion control to
                greenhouse innovation.
              </p>
              <div class="hero-cta-group">
                <button class="cta-btn cta-primary" @click="$router.push('/products')">
                  Explore Products
                  <i class="pi pi-arrow-right"></i>
                </button>
                <button class="cta-btn cta-ghost" @click="$router.push('/contact')">
                  Get in Touch
                </button>
              </div>
            </div>
          </div>

          <!-- Product Showcase Carousel -->
          <div class="bento-showcase" ref="bentoShowcase">
            <div class="showcase-inner">
              <div class="showcase-header">
                <span class="showcase-label">Featured Product</span>
                <div class="carousel-nav">
                  <button
                    class="nav-dot"
                    :class="{ active: currentSlide === i }"
                    v-for="(p, i) in carouselProducts"
                    :key="i"
                    @click="goToSlide(i)"
                  ></button>
                </div>
              </div>
              <div class="carousel-viewport">
                <transition name="slide-fade" mode="out-in">
                  <div class="carousel-slide" :key="currentSlide">
                    <img
                      :src="
                        carouselProducts[currentSlide]?.image_url ||
                        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
                      "
                      :alt="carouselProducts[currentSlide]?.name || 'Product'"
                      class="carousel-img"
                    />
                    <div class="carousel-info">
                      <h3>{{ carouselProducts[currentSlide]?.name || 'Loading...' }}</h3>
                      <p>
                        {{ truncateText(carouselProducts[currentSlide]?.description || '', 60) }}
                      </p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Stat Card 1 -->
          <div class="bento-stat" ref="bentoStat1">
            <div class="stat-inner">
              <span class="stat-number" ref="statCounter1">100%</span>
              <span class="stat-label">
                Natural &
                <br />
                Sustainable
              </span>
            </div>
          </div>

          <!-- Stat Card 2 -->
          <div class="bento-stat bento-stat-2" ref="bentoStat2">
            <div class="stat-inner">
              <span class="stat-number">50+</span>
              <span class="stat-label">
                Global
                <br />
                Partners
              </span>
            </div>
          </div>

          <!-- Category Quick Links -->
          <div class="bento-categories" ref="bentoCategories">
            <div class="bento-cat-inner">
              <span class="bento-cat-title">Quick Browse</span>
              <div class="bento-cat-list">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  class="bento-cat-chip"
                  @click="$router.push(`/category/${cat.slug}`)"
                >
                  {{ cat.name }}
                  <i class="pi pi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Scroll Prompt -->
          <div class="bento-scroll" ref="scrollIndicator">
            <div class="scroll-line"></div>
            <span>Scroll</span>
          </div>
        </div>
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
              Explore
              <i class="pi pi-arrow-right"></i>
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
                :src="
                  product.image_url ||
                  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
                "
                :alt="product.name"
              />
              <div class="product-badge">Featured</div>
            </div>
            <div class="product-info">
              <span class="product-category">{{ product.category_name }}</span>
              <h3>{{ product.name }}</h3>
              <p>{{ truncateText(product.description, 100) }}</p>
              <span class="product-link">
                View Details
                <i class="pi pi-arrow-right"></i>
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
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
import { useGSAP } from '@/composables/useGSAP';
import api from '@/services/api';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Refs for GSAP animations
const heroSection = ref(null);
const bentoMain = ref(null);
const bentoShowcase = ref(null);
const bentoStat1 = ref(null);
const bentoStat2 = ref(null);
const bentoCategories = ref(null);
const scrollIndicator = ref(null);
const categoriesSection = ref(null);
const sectionHeader = ref(null);
const categoriesGrid = ref(null);
const featuredSection = ref(null);
const productsGrid = ref(null);
const whyUsSection = ref(null);
const featuresGrid = ref(null);
const ctaSection = ref(null);

// Carousel state
const currentSlide = ref(0);
let carouselInterval = null;

// Data
const categories = ref([]);
const featuredProducts = ref([]);

const carouselProducts = computed(() => {
  return featuredProducts.value.length > 0
    ? featuredProducts.value.slice(0, 5)
    : [{ name: 'Loading...', description: '', image_url: '' }];
});

const goToSlide = (index) => {
  currentSlide.value = index;
  resetCarouselTimer();
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselProducts.value.length;
};

const resetCarouselTimer = () => {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 4000);
};

// GSAP instance
const { fadeIn, staggerIn, parallax, gsap, ScrollTrigger } = useGSAP();

// Fetch data
const fetchData = async () => {
  try {
    const [categoriesRes, productsRes] = await Promise.all([
      api.get('/categories'),
      api.get('/products?featured=true'),
    ]);

    if (categoriesRes.data.success) {
      categories.value = categoriesRes.data.data;
    }

    if (productsRes.data.success) {
      featuredProducts.value = productsRes.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

// Utility functions
const getCategoryIcon = (slug) => {
  const icons = {
    'erosion-control': 'pi pi-shield',
    greenhouse: 'pi pi-sun',
    gardening: 'pi pi-star',
  };
  return icons[slug] || 'pi pi-box';
};

const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Initialize animations
const initAnimations = () => {
  // Bento grid items stagger in
  const bentoItems = [
    bentoMain.value,
    bentoShowcase.value,
    bentoStat1.value,
    bentoStat2.value,
    bentoCategories.value,
  ].filter(Boolean);

  gsap.from(bentoItems, {
    opacity: 0,
    y: 40,
    scale: 0.96,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
  });

  // Floating animation on stat cards
  if (bentoStat1.value) {
    gsap.to(bentoStat1.value, {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: 'sine.inOut',
    });
  }
  if (bentoStat2.value) {
    gsap.to(bentoStat2.value, {
      y: 6,
      repeat: -1,
      yoyo: true,
      duration: 3.5,
      ease: 'sine.inOut',
      delay: 0.5,
    });
  }

  // Scroll prompt animation
  if (scrollIndicator.value) {
    gsap.to(scrollIndicator.value.querySelector('.scroll-line'), {
      scaleY: 1,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power1.inOut',
    });
  }

  // Categories section - background transition
  if (categoriesSection.value) {
    gsap.to(categoriesSection.value, {
      backgroundColor: '#FFFFFF',
      scrollTrigger: {
        trigger: categoriesSection.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    // Stagger animation for category cards
    staggerIn('.category-card', {
      scrollTrigger: {
        trigger: categoriesGrid.value,
        start: 'top 80%',
      },
      stagger: 0.15,
    });
  }

  // Featured products animation
  if (productsGrid.value) {
    staggerIn('.product-card', {
      scrollTrigger: {
        trigger: productsGrid.value,
        start: 'top 80%',
      },
      stagger: 0.12,
      y: 60,
    });
  }

  // Features grid animation
  if (featuresGrid.value) {
    staggerIn('.feature-item', {
      scrollTrigger: {
        trigger: featuresGrid.value,
        start: 'top 80%',
      },
      stagger: 0.1,
    });
  }

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
  resetCarouselTimer();
  setTimeout(() => {
    initAnimations();
  }, 100);
});

onUnmounted(() => {
  if (carouselInterval) clearInterval(carouselInterval);
});
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* ===== HERO - BENTO GRID ===== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 100px 0 40px;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(27, 94, 32, 0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%, rgba(0, 150, 136, 0.14) 0%, transparent 55%),
    linear-gradient(160deg, #0d2b1a 0%, #122e1e 30%, #0a3d2a 60%, #0e4434 100%);
  z-index: 0;
}

.hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  z-index: 1;
  pointer-events: none;
}

.hero-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

/* Bento Grid Layout */
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 0.85fr 0.45fr;
  grid-template-rows: auto auto auto;
  gap: 1rem;
  grid-template-areas:
    'main    showcase stat1'
    'main    showcase stat2'
    'cats    cats     scroll';
}

/* Glass card base */
.bento-main,
.bento-showcase,
.bento-stat,
.bento-categories {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* === Main Title Card === */
.bento-main {
  grid-area: main;
  padding: 3rem 2.5rem;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
}

.hero-badge-tag {
  display: inline-block;
  background: rgba(76, 175, 80, 0.15);
  color: #81c784;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.hero-title {
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: clamp(2.2rem, 4.2vw, 3.8rem);
  font-weight: 700;
  line-height: 1.1;
  color: #ffffff;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.title-accent {
  background: linear-gradient(135deg, #4caf50, #00bfa5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  max-width: 460px;
}

.hero-cta-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 0.85rem 1.8rem;
  border-radius: 14px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.cta-primary {
  background: linear-gradient(135deg, #2e7d32, #00897b);
  color: white;
  box-shadow: 0 8px 28px rgba(46, 125, 50, 0.35);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(46, 125, 50, 0.45);
}

.cta-ghost {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.cta-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* === Product Showcase Carousel === */
.bento-showcase {
  grid-area: showcase;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07) 0%, rgba(0, 150, 136, 0.06) 100%);
}

.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.showcase-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.45);
}

.carousel-nav {
  display: flex;
  gap: 6px;
}

.nav-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.nav-dot.active {
  background: #4caf50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  width: 20px;
  border-radius: 4px;
}

.carousel-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 280px;
}

.carousel-slide {
  text-align: center;
  width: 100%;
}

.carousel-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3));
}

.carousel-info h3 {
  font-family: var(--font-primary, 'Inter', sans-serif);
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.35rem;
}

.carousel-info p {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

/* Slide transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* === Stat Cards === */
.bento-stat {
  grid-area: stat1;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(0, 150, 136, 0.08) 100%);
}

.bento-stat-2 {
  grid-area: stat2;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.12) 0%, rgba(46, 125, 50, 0.08) 100%);
}

.stat-inner {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--font-display, 'Playfair Display', serif);
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #81c784, #4db6ac);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
  font-weight: 500;
}

/* === Category Quick Links === */
.bento-categories {
  grid-area: cats;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
}

.bento-cat-inner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.bento-cat-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
}

.bento-cat-list {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.bento-cat-chip {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.bento-cat-chip i {
  font-size: 0.6rem;
  opacity: 0.5;
}

.bento-cat-chip:hover {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
  color: #81c784;
}

/* === Scroll Indicator === */
.bento-scroll {
  grid-area: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.scroll-line {
  width: 1px;
  height: 32px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent);
  transform-origin: top;
  transform: scaleY(0.5);
}

.bento-scroll span {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.25);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'main     main'
      'showcase showcase'
      'stat1    stat2'
      'cats     cats'
      'scroll   scroll';
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 80px 0 24px;
    min-height: auto;
  }

  .bento-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'main'
      'showcase'
      'stat1'
      'stat2'
      'cats'
      'scroll';
    gap: 0.75rem;
  }

  .bento-main {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .bento-cat-inner {
    flex-direction: column;
    align-items: flex-start;
  }
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
  .categories-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    gap: 2rem;
  }
}
</style>
