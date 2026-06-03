<script setup>
import { RouterLink } from 'vue-router';

const currentYear = new Date().getFullYear();

const quickLinks = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'About Us', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

const categories = ['Erosion Control', 'Greenhouse Products', 'Gardening Products'];

const socials = [
  {
    icon: 'pi pi-facebook',
    href: 'https://www.facebook.com/share/1c1qK5iky2/?mibextid=wwXIfr',
    label: 'Facebook',
  },
  {
    icon: 'pi pi-instagram',
    href: 'https://www.instagram.com/sgprimeenterprises?igsh=MTZwMWtsN2ZnN2dvdg%3D%3D&utm_source=qr',
    label: 'Instagram',
  },
  { icon: 'pi pi-linkedin', href: '#', label: 'LinkedIn' },
];
</script>

<template>
  <footer class="bg-bark-800 text-coir-100">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="col-span-1 sm:col-span-2 lg:col-span-1">
          <div class="mb-4">
            <img
              src="/color-logo.png"
              alt="SG Prime Enterprises"
              class="h-12 w-auto object-contain"
            />
            <div class="leading-tight">
              <div class="font-display font-bold text-white text-sm">SG Prime</div>
              <div class="font-display font-bold text-earth-400 text-sm">Enterprises</div>
            </div>
          </div>
          <p class="text-coir-300 text-sm leading-relaxed mb-5">
            Premium coir-based products crafted from nature. Sustainable solutions for erosion
            control, greenhouse growing, and beautiful gardens.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              :aria-label="social.label"
              class="w-9 h-9 rounded-full bg-bark-700 hover:bg-earth-500 flex items-center justify-center transition-colors duration-200"
            >
              <i :class="social.icon" class="text-sm text-white"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3
            class="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-bark-600"
          >
            Quick Links
          </h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-coir-300 hover:text-earth-400 text-sm transition-colors flex items-center gap-2"
              >
                <i class="pi pi-angle-right text-earth-500 text-xs"></i>
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Product Categories -->
        <div>
          <h3
            class="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-bark-600"
          >
            Product Categories
          </h3>
          <ul class="space-y-3">
            <li v-for="cat in categories" :key="cat">
              <RouterLink
                to="/products"
                class="text-coir-300 hover:text-earth-400 text-sm transition-colors flex items-center gap-2"
              >
                <i class="pi pi-angle-right text-earth-500 text-xs"></i>
                {{ cat }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3
            class="font-display font-semibold text-white text-base mb-5 pb-2 border-b border-bark-600"
          >
            Contact Us
          </h3>
          <ul class="space-y-4 text-sm text-coir-300">
            <li class="flex gap-3">
              <i class="pi pi-map-marker text-earth-400 mt-0.5 shrink-0"></i>
              <span>Addarawtta, Kuleegoda, Ambalangoda, Sri Lanka</span>
            </li>
            <li class="flex gap-3">
              <i class="pi pi-phone text-earth-400 mt-0.5 shrink-0"></i>
              <a href="tel:+61449946069" class="hover:text-earth-400 transition-colors">
                +61 449 946 069
              </a>
            </li>
            <li class="flex gap-3">
              <i class="pi pi-envelope text-earth-400 mt-0.5 shrink-0"></i>
              <a
                href="mailto:info@sgprimeenterprises.com"
                class="hover:text-earth-400 transition-colors break-all"
              >
                info@sgprimeenterprises.com
              </a>
            </li>
            <li class="flex gap-3">
              <i class="pi pi-clock text-earth-400 mt-0.5 shrink-0"></i>
              <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-bark-700">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-coir-400"
      >
        <p>© {{ currentYear }} SG Prime Enterprises. All rights reserved.</p>
        <p class="flex items-center gap-1.5">
          <i class="pi pi-leaf text-earth-500"></i>
          Sustainably crafted coir products
        </p>
      </div>
    </div>
  </footer>
</template>
