<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <!-- Left Nav Links -->
      <div class="nav-left">
        <router-link to="/products" class="nav-link" @click="closeMobileMenu">PRODUCTS</router-link>
        <router-link to="/about" class="nav-link" @click="closeMobileMenu">ABOUT US</router-link>
      </div>

      <!-- Center Logo -->
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2c1.4 0 2.7.4 3.8 1-1.2.7-2.4 1.7-3.3 3-.9-1.3-2.1-2.3-3.3-3C10.3 4.4 11.6 4 13 4 12.3 4 12 4 12 4zm-6 8c0-1.1.3-2.1.7-3 1.2.8 2.3 2 3 3.5.7-1.5 1.8-2.7 3-3.5C11.7 7.9 11 6.9 11 6c2 0 3.5 1.5 4.3 3.2.8-1.7 2.3-3.2 4.3-3.2-1 2-2.8 3.5-5 4 2.2.5 4 2 5 4-2 0-3.5-1.5-4.3-3.2-.8 1.7-2.3 3.2-4.3 3.2 1-2 2.8-3.5 5-4-2.2-.5-4-2-5-4z"
              fill="currentColor"
            />
          </svg>
          <span class="logo-leaf">🌿</span>
        </div>
        <span class="logo-text">SG PRIME</span>
      </router-link>

      <!-- Right Nav Links -->
      <div class="nav-right">
        <router-link to="/sustainability" class="nav-link" @click="closeMobileMenu">
          SUSTAINABILITY
        </router-link>
        <router-link to="/contact" class="nav-link" @click="closeMobileMenu">CONTACT</router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
      </button>
    </div>

    <!-- Mobile Slide Menu -->
    <div class="mobile-menu" :class="{ active: mobileMenuOpen }">
      <router-link to="/products" class="mobile-link" @click="closeMobileMenu">
        PRODUCTS
      </router-link>
      <router-link to="/about" class="mobile-link" @click="closeMobileMenu">ABOUT US</router-link>
      <router-link to="/sustainability" class="mobile-link" @click="closeMobileMenu">
        SUSTAINABILITY
      </router-link>
      <router-link to="/contact" class="mobile-link" @click="closeMobileMenu">CONTACT</router-link>
    </div>
  </nav>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const categories = ref([]);

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    if (response.data.success) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

onMounted(() => {
  fetchCategories();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  padding: 0.5rem 2rem;
}

.navbar-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(27, 60, 30, 0.88);
  backdrop-filter: blur(12px);
  border-radius: 50px;
  padding: 0.6rem 2rem;
  gap: 1.5rem;
}

.navbar.scrolled .navbar-inner {
  background-color: rgba(27, 60, 30, 0.96);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Nav Links */
.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 0.8rem;
  text-decoration: none;
  letter-spacing: 0.1em;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #ffffff;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 0 1rem;
  white-space: nowrap;
}

.logo-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-leaf {
  font-size: 1.4rem;
  line-height: 1;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.05em;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  align-items: center;
  background-color: rgba(27, 60, 30, 0.96);
  border-radius: 16px;
  margin-top: 0.5rem;
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.mobile-menu.active {
  padding: 1rem;
  max-height: 300px;
}

.mobile-link {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  font-size: 0.85rem;
  text-decoration: none;
  letter-spacing: 0.1em;
  padding: 0.75rem 1.5rem;
  width: 100%;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .nav-left,
  .nav-right {
    display: none;
  }

  .mobile-toggle {
    display: block;
    position: absolute;
    right: 1.5rem;
  }

  .mobile-menu {
    display: flex;
  }

  .navbar-inner {
    justify-content: center;
    position: relative;
    padding: 0.6rem 1.5rem;
  }
}
</style>
