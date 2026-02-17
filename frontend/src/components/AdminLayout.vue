<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>SG Prime</h2>
        <p>Admin Panel</p>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <i class="pi pi-chart-line"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="nav-item">
          <i class="pi pi-box"></i>
          <span>Products</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item">
          <i class="pi pi-tags"></i>
          <span>Categories</span>
        </router-link>
        <router-link to="/admin/enquiries" class="nav-item">
          <i class="pi pi-envelope"></i>
          <span>Enquiries</span>
        </router-link>
      </nav>

      <button @click="handleLogout" class="logout-btn">
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button>
    </aside>

    <div class="main-content">
      <header class="admin-header">
        <h1>{{ pageTitle }}</h1>
      </header>

      <div class="admin-body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const pageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products': 'Manage Products',
    '/admin/categories': 'Manage Categories',
    '/admin/enquiries': 'Manage Enquiries'
  }
  return titles[route.path] || 'Admin'
})

const handleLogout = () => {
  authStore.logout()
  toast.add({
    severity: 'info',
    summary: 'Logged Out',
    detail: 'You have been logged out successfully',
    life: 2000
  })
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 260px;
  background-color: var(--color-brand);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  color: white;
  margin-bottom: 0.25rem;
}

.sidebar-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: white;
  opacity: 0.8;
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.router-link-active {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.15);
  border-left-color: var(--color-canvas);
}

.nav-item i {
  font-size: 1.25rem;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: white;
  opacity: 0.9;
  cursor: pointer;
  transition: all var(--transition-fast);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn i {
  font-size: 1.25rem;
}

.main-content {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: white;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0;
}

.admin-body {
  padding: 2rem;
  flex: 1;
}

@media (max-width: 968px) {
  .sidebar {
    width: 200px;
  }

  .main-content {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .sidebar-header p,
  .nav-item span,
  .logout-btn span {
    display: none;
  }

  .main-content {
    margin-left: 70px;
  }
}
</style>
