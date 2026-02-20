import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

// Public views
import ContactView from '../views/ContactView.vue';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';

const routes = [
  // ── Public ─────────────────────────────────────────────
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'SG Prime Enterprises - Industrial Coir Products' },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { title: 'Our Products - SG Prime Enterprises' },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'Product Details - SG Prime Enterprises' },
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: () => import('../views/CategoryView.vue'),
    meta: { title: 'Category - SG Prime Enterprises' },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: { title: 'Contact Us - SG Prime Enterprises' },
  },

  // ── Admin ───────────────────────────────────────────────
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/AdminLogin.vue'),
    meta: { title: 'Admin Login' },
  },
  {
    path: '/admin',
    component: () => import('../components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/DashboardPage.vue'),
        meta: { title: 'Dashboard - Admin' },
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('../views/admin/ProductsManagement.vue'),
        meta: { title: 'Products - Admin' },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('../views/admin/CategoriesManagement.vue'),
        meta: { title: 'Categories - Admin' },
      },
      {
        path: 'enquiries',
        name: 'AdminEnquiries',
        component: () => import('../views/admin/EnquiriesManagement.vue'),
        meta: { title: 'Enquiries - Admin' },
      },
      {
        path: 'change-password',
        name: 'AdminChangePassword',
        component: () => import('../views/admin/ChangePassword.vue'),
        meta: { title: 'Change Password - Admin' },
      },
      {
        path: '',
        redirect: '/admin/dashboard',
      },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

// Navigation guard — protect admin routes
router.beforeEach(async (to, from, next) => {
  // Update document title
  if (to.meta.title) document.title = to.meta.title;

  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    const verified = await authStore.verifyToken();
    if (!verified) {
      return next({ name: 'AdminLogin' });
    }
  }
  next();
});

export default router;
