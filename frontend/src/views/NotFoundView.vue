<template>
  <div class="min-h-[70vh] flex items-center justify-center bg-cream py-20">
    <div class="text-center max-w-lg px-6">
      <div class="w-24 h-24 rounded-full bg-earth-50 border-2 border-earth-100 flex items-center justify-center mx-auto mb-8">
        <span class="font-display font-bold text-earth-400 text-4xl">404</span>
      </div>
      <h1 class="font-display font-bold text-bark-800 text-3xl md:text-4xl mb-4">
        Page Not Found
      </h1>
      <p class="text-bark-500 text-base leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved. Try the links below.
      </p>
      <div class="flex items-center justify-center gap-4 flex-wrap">
        <RouterLink to="/" class="btn-primary gap-2">
          <i class="pi pi-home"></i>
          Go Home
        </RouterLink>
        <RouterLink to="/products" class="btn-secondary gap-2">
          <i class="pi pi-box"></i>
          View Products
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
