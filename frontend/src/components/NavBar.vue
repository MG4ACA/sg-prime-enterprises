<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const mobileOpen = ref(false);
const scrolled = ref(false);

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'About Us', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
}

function closeMobile() {
  mobileOpen.value = false;
}

function handleScroll() {
  scrolled.value = window.scrollY > 20;
}

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <!-- Floating centered glass navbar -->
  <header class="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
    <div
      class="w-full max-w-5xl flex items-center justify-between gap-4 px-5 py-3 rounded-2xl transition-all duration-300"
      :class="
        scrolled
          ? 'bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/10'
          : 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg shadow-black/5'
      "
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 group shrink-0" @click="closeMobile">
        <div
          class="w-9 h-9 rounded-full bg-earth-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
        >
          <i class="pi pi-leaf text-white text-base"></i>
        </div>
        <div class="leading-tight">
          <div class="font-display font-bold text-bark-800 text-sm leading-none">SG Prime</div>
          <div class="font-display font-bold text-earth-500 text-sm leading-none">Enterprises</div>
        </div>
      </RouterLink>

      <!-- Desktop Nav — centered absolutely -->
      <nav class="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative px-4 py-2 font-medium text-sm rounded-xl transition-all duration-200"
          :class="
            route.path === link.to
              ? 'text-earth-600 bg-white/50 font-semibold'
              : 'text-bark-700 hover:text-earth-600 hover:bg-white/40'
          "
        >
          {{ link.name }}
          <span
            v-if="route.path === link.to"
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-earth-500 rounded-full"
          ></span>
        </RouterLink>
      </nav>

      <!-- CTA + Mobile Hamburger -->
      <div class="flex items-center gap-2 shrink-0">
        <RouterLink to="/contact" class="hidden md:inline-flex btn-primary text-sm py-2 px-5">
          Get a Quote
        </RouterLink>
        <button
          @click="toggleMobile"
          class="md:hidden p-2 rounded-xl text-bark-700 hover:bg-white/40 transition-colors"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        >
          <i :class="mobileOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div
        v-if="mobileOpen"
        class="md:hidden absolute top-full mt-2 left-4 right-4 bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden"
      >
        <nav class="px-4 py-4 flex flex-col gap-1">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="closeMobile"
            class="px-4 py-3 rounded-xl font-medium transition-colors"
            :class="
              route.path === link.to
                ? 'bg-earth-50/80 text-earth-600 font-semibold'
                : 'text-bark-700 hover:bg-white/60 hover:text-earth-600'
            "
          >
            {{ link.name }}
          </RouterLink>
          <RouterLink to="/contact" @click="closeMobile" class="mt-2 btn-primary text-center">
            Get a Quote
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>

  <!-- Spacer -->
  <div class="h-20"></div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
