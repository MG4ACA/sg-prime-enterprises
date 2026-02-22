<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div
          :class="[
            'w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0',
            stat.iconBg,
          ]"
        >
          <i :class="[stat.icon, stat.iconColor]"></i>
        </div>
        <div class="min-w-0">
          <p class="text-xs sm:text-sm text-gray-500 mb-0.5">{{ stat.label }}</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-800 truncate">{{ stats[stat.key] }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Enquiries -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-gray-100">
        <h2 class="text-base sm:text-lg font-semibold text-gray-800">Recent Enquiries</h2>
      </div>

      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
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

      <!-- Mobile Card View -->
      <div class="sm:hidden">
        <div v-if="loading" class="p-4">
          <p class="text-center text-gray-500">Loading...</p>
        </div>
        <div v-else-if="recentEnquiries.length === 0" class="p-4">
          <p class="text-center text-gray-500">No enquiries found</p>
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="enquiry in recentEnquiries"
            :key="enquiry.id"
            class="p-4 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm">{{ enquiry.name }}</h3>
              <span :class="['status-badge text-xs', enquiry.status]">{{ enquiry.status }}</span>
            </div>
            <div class="space-y-1 text-xs text-gray-600">
              <p>
                <span class="font-medium">Email:</span>
                {{ enquiry.email }}
              </p>
              <p>
                <span class="font-medium">Company:</span>
                {{ enquiry.company }}
              </p>
              <p>
                <span class="font-medium">Product:</span>
                {{ enquiry.product_name }}
              </p>
              <p>
                <span class="font-medium">Date:</span>
                {{ formatDate(enquiry.created_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>
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
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: 'pi pi-box',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    key: 'totalCategories',
    label: 'Categories',
    icon: 'pi pi-tags',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    key: 'totalEnquiries',
    label: 'Total Enquiries',
    icon: 'pi pi-envelope',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    key: 'pendingEnquiries',
    label: 'Pending',
    icon: 'pi pi-clock',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
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
.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}
.status-badge.contacted {
  background: #dbeafe;
  color: #2563eb;
}
.status-badge.resolved {
  background: #dcfce7;
  color: #16a34a;
}
</style>
