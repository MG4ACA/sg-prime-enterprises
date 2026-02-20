<template>
  <div>
    <!-- Filter -->
    <div class="flex gap-3 mb-5">
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Filter by status"
        class="w-52"
        @change="fetchEnquiries"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <DataTable :value="enquiries" :loading="loading" paginator :rows="15">
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="company" header="Company" />
        <Column field="phone" header="Phone" />
        <Column field="product_name" header="Product Interest" />
        <Column field="status" header="Status" style="width: 160px">
          <template #body="{ data }">
            <Select
              v-model="data.status"
              :options="['pending', 'contacted', 'resolved']"
              class="w-full"
              @change="updateStatus(data)"
            />
          </template>
        </Column>
        <Column field="created_at" header="Date" sortable>
          <template #body="{ data }">{{ formatDate(data.created_at) }}</template>
        </Column>
        <Column header="" style="width: 70px">
          <template #body="{ data }">
            <Button icon="pi pi-eye" text size="small" @click="viewEnquiry(data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Enquiry Detail Dialog -->
    <Dialog
      v-model:visible="detailsVisible"
      header="Enquiry Details"
      :style="{ width: '600px' }"
      modal
    >
      <div v-if="selectedEnquiry" class="flex flex-col gap-4 pt-2">
        <div v-for="row in detailRows" :key="row.label" class="flex gap-4 text-sm">
          <span class="text-gray-500 min-w-36 font-medium">{{ row.label }}</span>
          <span class="text-gray-800">{{ row.value }}</span>
        </div>
        <div class="flex flex-col gap-2 text-sm">
          <span class="text-gray-500 font-medium">Message</span>
          <p class="bg-gray-50 rounded-lg p-4 text-gray-800 leading-relaxed m-0">
            {{ selectedEnquiry.message }}
          </p>
        </div>
        <div class="flex gap-4 text-sm">
          <span class="text-gray-500 min-w-36 font-medium">Status</span>
          <span :class="['status-badge', selectedEnquiry.status]">{{ selectedEnquiry.status }}</span>
        </div>
      </div>

      <template #footer>
        <Button label="Close" text @click="detailsVisible = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();

const enquiries = ref([]);
const loading = ref(false);
const selectedStatus = ref('all');
const detailsVisible = ref(false);
const selectedEnquiry = ref(null);

const statusOptions = [
  { label: 'All Enquiries', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Resolved', value: 'resolved' },
];

const detailRows = computed(() => {
  if (!selectedEnquiry.value) return [];
  const e = selectedEnquiry.value;
  return [
    { label: 'Name', value: e.name },
    { label: 'Email', value: e.email },
    { label: 'Company', value: e.company || 'N/A' },
    { label: 'Phone', value: e.phone || 'N/A' },
    { label: 'Product Interest', value: e.product_name || 'General Enquiry' },
    { label: 'Date', value: formatDate(e.created_at) },
  ];
});

const fetchEnquiries = async () => {
  loading.value = true;
  try {
    const url =
      selectedStatus.value === 'all'
        ? '/admin/enquiries'
        : `/admin/enquiries?status=${selectedStatus.value}`;
    const response = await api.get(url);
    if (response.data.success) enquiries.value = response.data.data;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch enquiries', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (enquiry) => {
  try {
    const response = await api.patch(`/admin/enquiries/${enquiry.id}`, { status: enquiry.status });
    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Updated', detail: 'Status updated', life: 2000 });
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status', life: 3000 });
    fetchEnquiries();
  }
};

const viewEnquiry = (enquiry) => {
  selectedEnquiry.value = enquiry;
  detailsVisible.value = true;
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

onMounted(fetchEnquiries);
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
.status-badge.pending   { background: #fef3c7; color: #d97706; }
.status-badge.contacted { background: #dbeafe; color: #2563eb; }
.status-badge.resolved  { background: #dcfce7; color: #16a34a; }
</style>
