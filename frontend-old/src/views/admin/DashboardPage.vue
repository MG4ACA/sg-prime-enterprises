<template>
  <div class="dashboard-page">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon products">
          <i class="pi pi-box"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Products</p>
          <h2 class="stat-value">{{ stats.totalProducts }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon categories">
          <i class="pi pi-tags"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Categories</p>
          <h2 class="stat-value">{{ stats.totalCategories }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon enquiries">
          <i class="pi pi-envelope"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Enquiries</p>
          <h2 class="stat-value">{{ stats.totalEnquiries }}</h2>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="pi pi-clock"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">Pending Enquiries</p>
          <h2 class="stat-value">{{ stats.pendingEnquiries }}</h2>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <h2>Recent Enquiries</h2>
      <DataTable
        :value="recentEnquiries"
        :loading="loading"
        paginator
        :rows="5"
        class="admin-table"
      >
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="company" header="Company" />
        <Column field="product_name" header="Product" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span :class="['status-badge', data.status]">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column field="created_at" header="Date">
          <template #body="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';

const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalEnquiries: 0,
  pendingEnquiries: 0,
});

const recentEnquiries = ref([]);
const loading = ref(true);

const fetchDashboardData = async () => {
  try {
    const [productsRes, categoriesRes, enquiriesRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/categories'),
      api.get('/admin/enquiries'),
    ]);

    if (productsRes.data.success) {
      stats.value.totalProducts = productsRes.data.data.length;
    }

    if (categoriesRes.data.success) {
      stats.value.totalCategories = categoriesRes.data.data.length;
    }

    if (enquiriesRes.data.success) {
      const enquiries = enquiriesRes.data.data;
      stats.value.totalEnquiries = enquiries.length;
      stats.value.pendingEnquiries = enquiries.filter((e) => e.status === 'pending').length;
      recentEnquiries.value = enquiries.slice(0, 10);
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: white;
  padding: 1.75rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all var(--transition-medium);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-icon.products {
  background-color: #e0f2fe;
  color: #0284c7;
}

.stat-icon.categories {
  background-color: #f3e8ff;
  color: #9333ea;
}

.stat-icon.enquiries {
  background-color: #fef3c7;
  color: #d97706;
}

.stat-icon.pending {
  background-color: #fee2e2;
  color: #dc2626;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
}

.recent-section {
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.recent-section h2 {
  margin-bottom: 1.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.contacted {
  background-color: #dbeafe;
  color: #0284c7;
}

.status-badge.resolved {
  background-color: #dcfce7;
  color: #16a34a;
}
</style>
