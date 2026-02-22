<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <i class="pi pi-leaf text-white text-sm"></i>
          </div>
          <div>
            <p class="font-bold text-white text-sm leading-none">SG Prime</p>
            <p class="text-white/60 text-xs">Admin Panel</p>
          </div>
        </div>
        <!-- Close button for mobile -->
        <button @click="sidebarOpen = false" class="close-sidebar-btn lg:hidden">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" @click="sidebarOpen = false">
          <i class="pi pi-chart-line"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item" @click="sidebarOpen = false">
          <i class="pi pi-box"></i>
          <span>Products</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item" @click="sidebarOpen = false">
          <i class="pi pi-tags"></i>
          <span>Categories</span>
        </router-link>
        <router-link to="/admin/enquiries" class="nav-item" @click="sidebarOpen = false">
          <i class="pi pi-envelope"></i>
          <span>Enquiries</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/admin/change-password" class="nav-item mb-2" @click="sidebarOpen = false">
          <i class="pi pi-lock"></i>
          <span>Change Password</span>
        </router-link>
        <a href="/" target="_blank" class="nav-item mb-2">
          <i class="pi pi-external-link"></i>
          <span>View Site</span>
        </a>
        <button @click="handleLogout" class="logout-btn">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Sidebar backdrop for mobile -->
    <div v-if="sidebarOpen" class="sidebar-backdrop lg:hidden" @click="sidebarOpen = false"></div>

    <!-- Main content -->
    <div class="main-content">
      <header class="admin-header">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = !sidebarOpen" class="toggle-sidebar-btn lg:hidden">
            <i :class="sidebarOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
        </div>
      </header>

      <div class="admin-body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const sidebarOpen = ref(false);

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products': 'Manage Products',
    '/admin/categories': 'Manage Categories',
    '/admin/enquiries': 'Manage Enquiries',
    '/admin/change-password': 'Change Password',
  };
  return titles[route.path] || 'Admin';
});

const handleLogout = () => {
  authStore.logout();
  toast.add({
    severity: 'info',
    summary: 'Logged Out',
    detail: 'You have been logged out successfully',
    life: 2000,
  });
  router.push('/admin/login');
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2a452f 0%, #3d6849 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
  transition: transform 0.3s ease;
}

/* Mobile sidebar styles */
@media (max-width: 1023px) {
  .sidebar {
    width: 250px;
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: none;
}

@media (max-width: 1023px) {
  .sidebar-backdrop {
    display: block;
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-sidebar-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-sidebar-btn:hover {
  opacity: 0.8;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: white;
}

.nav-item.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

@media (max-width: 1023px) {
  .main-content {
    margin-left: 0;
  }
}

.admin-header {
  background-color: white;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
}

@media (min-width: 640px) {
  .admin-header {
    padding: 1rem 2rem;
  }
}

.toggle-sidebar-btn {
  background: none;
  border: none;
  color: #1f2937;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-sidebar-btn:hover {
  opacity: 0.7;
}

.admin-body {
  flex: 1;
  padding: 1rem;
}

@media (min-width: 640px) {
  .admin-body {
    padding: 1.5rem;
  }
}

@media (min-width: 768px) {
  .admin-body {
    padding: 2rem;
  }
}
</style>
