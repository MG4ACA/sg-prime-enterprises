<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm border border-coir-100 card-hover group"
    :class="compact ? '' : ''"
  >
    <!-- Image -->
    <div class="relative overflow-hidden" :class="compact ? 'h-44' : 'h-52'">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <!-- Category badge -->
      <span class="absolute top-3 left-3 badge bg-earth-500/90 text-white text-xs backdrop-blur-sm">
        {{ product.category }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="font-display font-semibold text-bark-800 text-lg leading-snug mb-2">
        {{ product.name }}
      </h3>
      <p
        class="text-bark-500 text-sm leading-relaxed"
        :class="compact ? 'line-clamp-2' : 'line-clamp-3'"
      >
        {{ product.description }}
      </p>

      <div v-if="!compact" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in product.tags"
          :key="tag"
          class="badge bg-earth-50 text-earth-600 border border-earth-200"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <a
          href="/contact"
          class="text-earth-600 font-semibold text-sm hover:text-earth-700 flex items-center gap-1.5 transition-colors"
        >
          Enquire Now
          <i class="pi pi-arrow-right text-xs"></i>
        </a>
        <span class="text-coir-300 text-xs flex items-center gap-1">
          <i class="pi pi-leaf text-earth-400 text-xs"></i>
          Natural
        </span>
      </div>
    </div>
  </div>
</template>
