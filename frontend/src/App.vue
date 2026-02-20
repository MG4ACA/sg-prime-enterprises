<script setup>
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isAdminRoute = () => route.path.startsWith('/admin');
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream">
    <PToast position="top-right" />
    <ConfirmDialog />

    <!-- Public layout wrapper (Navbar + Footer) -->
    <template v-if="!isAdminRoute()">
      <NavBar />
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
