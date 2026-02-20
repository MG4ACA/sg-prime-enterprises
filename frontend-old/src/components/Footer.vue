<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="footer-logo">
            <span class="logo-text">SG Prime</span>
            <span class="logo-sub">Enterprises</span>
          </div>
          <p class="footer-desc">
            Premium industrial coir products manufacturer. Providing sustainable solutions for
            erosion control, greenhouse, and gardening applications.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><router-link to="/admin/login">Admin Portal</router-link></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="footer-section">
          <h4>Product Categories</h4>
          <ul class="footer-links">
            <li><router-link to="/category/erosion-control">Erosion Control</router-link></li>
            <li><router-link to="/category/greenhouse">Greenhouse Products</router-link></li>
            <li><router-link to="/category/gardening">Gardening Products</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4>Contact</h4>
          <div class="contact-info">
            <p>
              <i class="pi pi-envelope"></i>
              contact@sgprimeenterprises.com
            </p>
            <p>
              <i class="pi pi-phone"></i>
              +1 (555) 123-4567
            </p>
            <p>
              <i class="pi pi-map-marker"></i>
              Industrial Zone, City, Country
            </p>
          </div>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="pi pi-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i class="pi pi-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin"></i></a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} SG Prime Enterprises. All rights reserved.</p>
        <p class="built-with">Built with excellence for sustainability</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background-color: var(--color-text);
  color: var(--color-canvas);
  padding: 4rem 0 2rem;
  margin-top: 6rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h4 {
  color: var(--color-secondary);
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
  font-family: var(--font-display);
}

.footer-logo {
  margin-bottom: 1rem;
}

.logo-text {
  display: block;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-secondary);
}

.logo-sub {
  display: block;
  font-size: 0.875rem;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer-desc {
  color: rgba(255, 241, 232, 0.8);
  line-height: 1.7;
  font-size: 0.95rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: rgba(255, 241, 232, 0.8);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--color-secondary);
}

.contact-info {
  margin-bottom: 1.5rem;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: rgba(255, 241, 232, 0.8);
  font-size: 0.95rem;
}

.contact-info i {
  color: var(--color-secondary);
  font-size: 1.125rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 241, 232, 0.1);
  border-radius: 50%;
  color: var(--color-secondary);
  transition: all var(--transition-medium);
}

.social-links a:hover {
  background-color: var(--color-secondary);
  color: var(--color-text);
  transform: translateY(-3px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 241, 232, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 241, 232, 0.6);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.built-with {
  font-style: italic;
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
    margin-top: 4rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
