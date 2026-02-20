<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div :class="['w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0', stat.iconBg]">
          <i :class="[stat.icon, stat.iconColor]"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-0.5">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats[stat.key] }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Enquiries -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-800">Recent Enquiries</h2>
      </div>
      <DataTable :value="recentEnquiries" :loading="loading" :rows="5" class="admin-table">
        <Column field="name" header="Name" />
        <Column field="email" header="Email" />
        <Column field="company" header="Company" />
        <Column field="product_name" header="Product" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span :class="['status-badge', data.status]">{{ data.status }}</span>
          </template>
        </Column>
        <Column field="created_at" header="Date">
          <template #body="{ data }">{{ formatDate(data.created_at) }}</template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';

const stats = ref({ totalProducts: 0, totalCategories: 0, totalEnquiries: 0, pendingEnquiries: 0 });
const recentEnquiries = ref([]);
const loading = ref(true);

const statCards = [
  { key: 'totalProducts', label: 'Total Products', icon: 'pi pi-box', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { key: 'totalCategories', label: 'Categories', icon: 'pi pi-tags', iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
  { key: 'totalEnquiries', label: 'Total Enquiries', icon: 'pi pi-envelope', iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { key: 'pendingEnquiries', label: 'Pending', icon: 'pi pi-clock', iconBg: 'bg-red-50', iconColor: 'text-red-500' },
];

const fetchDashboardData = async () => {
  try {
    const [productsRes, categoriesRes, enquiriesRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/categories'),
      api.get('/admin/enquiries'),
    ]);

    if (productsRes.data.success) stats.value.totalProducts = productsRes.data.data.length;
    if (categoriesRes.data.success) stats.value.totalCategories = categoriesRes.data.data.length;
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

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

onMounted(fetchDashboardData);
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-badge.pending    { background: #fef3c7; color: #d97706; }
.status-badge.contacted  { background: #dbeafe; color: #2563eb; }
.status-badge.resolved   { background: #dcfce7; color: #16a34a; }
</style>
