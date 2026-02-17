import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: 'SG Prime Enterprises - Industrial Coir Products',
      description: 'Premium industrial coir products manufacturer'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsPage.vue'),
    meta: {
      title: 'Our Products - SG Prime Enterprises',
      description: 'Browse our complete range of coir products'
    }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailPage.vue'),
    meta: {
      title: 'Product Details - SG Prime Enterprises'
    }
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: () => import('@/views/CategoryPage.vue'),
    meta: {
      title: 'Category - SG Prime Enterprises'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactPage.vue'),
    meta: {
      title: 'Contact Us - SG Prime Enterprises',
      description: 'Get in touch with our team'
    }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/AdminLogin.vue'),
    meta: {
      title: 'Admin Login'
    }
  },
  {
    path: '/admin',
    component: () => import('@/components/AdminLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: {
          title: 'Admin Dashboard'
        }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/ProductsManagement.vue'),
        meta: {
          title: 'Manage Products'
        }
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/CategoriesManagement.vue'),
        meta: {
          title: 'Manage Categories'
        }
      },
      {
        path: 'enquiries',
        name: 'AdminEnquiries',
        component: () => import('@/views/admin/EnquiriesManagement.vue'),
        meta: {
          title: 'Manage Enquiries'
        }
      },
      {
        path: '',
        redirect: '/admin/dashboard'
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: {
      title: '404 - Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'SG Prime Enterprises'
  
  // Update meta description
  if (to.meta.description) {
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag) {
      descriptionTag.setAttribute('content', to.meta.description)
    }
  }
  
  // Check authentication for admin routes
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
