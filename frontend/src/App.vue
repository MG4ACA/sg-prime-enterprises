<script setup>
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';

const route = useRoute();

const isAdminRoute = () => route.path.startsWith('/admin');
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream">
    <PToast position="top-right" />
    <ConfirmDialog />

    <!-- Public layout wrapper (Navbar + Footer) -->
    <template v-if="!isAdminRoute()">
      <Navbar />
      <main class="flex-1">
        <RouterView />
      </main>
      <Footer />
    </template>

    <!-- Admin layout (AdminLayout component handles its own chrome) -->
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>
