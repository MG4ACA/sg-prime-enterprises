<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-text">SG Prime</span>
          <span class="logo-sub">Enterprises</span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="nav-menu" :class="{ 'active': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">Home</router-link>
          <router-link to="/products" class="nav-link" @click="closeMobileMenu">Products</router-link>
          
          <!-- Categories Dropdown -->
          <div class="nav-dropdown">
            <span class="nav-link">Categories</span>
            <div class="dropdown-menu">
              <router-link 
                v-for="category in categories" 
                :key="category.id"
                :to="`/category/${category.slug}`"
                class="dropdown-item"
                @click="closeMobileMenu"
              >
                {{ category.name }}
              </router-link>
            </div>
          </div>

          <router-link to="/contact" class="nav-link" @click="closeMobileMenu">Contact</router-link>
          
          <Button 
            label="Get Quote" 
            class="btn-quote"
            @click="navigateToContact"
          />
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const categories = ref([])

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const navigateToContact = () => {
  router.push('/contact')
  closeMobileMenu()
}

onMounted(() => {
  fetchCategories()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 241, 232, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.25rem 0;
  transition: all 0.3s ease;
  z-index: 1000;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  padding: 0.75rem 0;
  background-color: rgba(255, 241, 232, 0.98);
  box-shadow: var(--shadow-md);
  border-bottom-color: rgba(154, 90, 46, 0.1);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  line-height: 1.2;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand);
}

.logo-sub {
  font-size: 0.75rem;
  color: var(--color-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  transition: color var(--transition-fast);
  cursor: pointer;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-brand);
  transition: width var(--transition-medium);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-brand);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Dropdown */
.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--transition-medium);
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background-color: var(--color-canvas);
  color: var(--color-brand);
}

/* Quote Button */
.btn-quote {
  background-color: var(--color-brand);
  border: none;
  padding: 0.675rem 1.5rem;
  font-weight: 600;
}

.btn-quote:hover {
  background-color: var(--color-secondary);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-brand);
  cursor: pointer;
  padding: 0.5rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 70px;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: calc(100vh - 70px);
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    gap: 1.5rem;
    box-shadow: var(--shadow-lg);
    transition: right 0.3s ease;
  }

  .nav-menu.active {
    right: 0;
  }

  .nav-link {
    width: 100%;
  }

  .nav-dropdown {
    width: 100%;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border-left: 2px solid var(--color-brand);
    margin-top: 0.5rem;
  }

  .btn-quote {
    width: 100%;
  }
}
</style>
