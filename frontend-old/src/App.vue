<template>
  <div id="app">
    <router-view />
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useLenis } from '@/composables/useLenis';
import { onMounted } from 'vue';

// Initialize smooth scrolling
const { initLenis } = useLenis();

onMounted(() => {
  initLenis();
});
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
