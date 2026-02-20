<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
});

const currentSlide = ref(0);
let autoplayInterval = null;

const goToSlide = (index) => {
  currentSlide.value = index;
  resetAutoplay();
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length;
};

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const resetAutoplay = () => {
  clearInterval(autoplayInterval);
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  clearInterval(autoplayInterval);
});
</script>

<template>
  <section class="relative h-screen w-screen overflow-hidden">
    <!-- Slides Container -->
    <div class="relative h-full w-full">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="absolute inset-0 transition-opacity duration-1000"
        :class="index === currentSlide ? 'opacity-100' : 'opacity-0'"
      >
        <!-- Background image -->
        <img
          :src="slide.image"
          :alt="slide.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        ></div>

        <!-- Content -->
        <div class="relative h-full flex items-center">
          <div class="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div class="max-w-xl">
              <span
                class="badge text-white mb-5 inline-flex items-center gap-2"
                :class="slide.accent + '/90'"
              >
                <i class="pi pi-leaf text-xs"></i>
                {{ slide.tag }}
              </span>
              <h1
                class="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5 whitespace-pre-line"
              >
                {{ slide.title }}
              </h1>
              <p class="text-white/85 text-lg leading-relaxed mb-8 max-w-md">
                {{ slide.description }}
              </p>
              <div class="flex flex-wrap gap-4">
                <RouterLink :to="slide.cta.to" class="btn-primary">
                  {{ slide.cta.label }}
                  <i class="pi pi-arrow-right ml-2 text-xs"></i>
                </RouterLink>
                <RouterLink
                  to="/about"
                  class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                >
                  Our Story
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dot Indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </section>
</template>

<style scoped>
/* Smooth fade transition for slides */
.transition-opacity {
  will-change: opacity;
}
</style>
