<template>
  <div>
    <!-- Filter -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Filter by status"
        class="w-full sm:w-52"
        @change="fetchEnquiries"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
        <DataTable :value="enquiries" :loading="loading" paginator :rows="15">
          <Column header="Contact" sortable sortField="name">
            <template #body="{ data }">
              <div class="text-sm">
                <p class="font-medium text-gray-800">{{ data.name }}</p>
                <p class="text-xs text-gray-500">{{ data.email }}</p>
              </div>
            </template>
          </Column>
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
          <Column header="" style="width: 110px">
            <template #body="{ data }">
              <Button icon="pi pi-eye" text size="small" @click="viewEnquiry(data)" />
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                @click="confirmDelete(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Mobile Card View -->
      <div class="sm:hidden">
        <div v-if="loading" class="p-4">
          <p class="text-center text-gray-500">Loading...</p>
        </div>
        <div v-else-if="enquiries.length === 0" class="p-4">
          <p class="text-center text-gray-500">No enquiries found</p>
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="enquiry in enquiries"
            :key="enquiry.id"
            class="p-4 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-semibold text-gray-800 text-sm">{{ enquiry.name }}</h3>
                <p class="text-xs text-gray-500">{{ enquiry.email }}</p>
              </div>
              <div class="flex gap-1">
                <Button icon="pi pi-eye" text size="small" @click="viewEnquiry(enquiry)" />
                <Button
                  icon="pi pi-trash"
                  text
                  size="small"
                  severity="danger"
                  @click="confirmDelete(enquiry)"
                />
              </div>
            </div>
            <div class="space-y-2 text-xs text-gray-600 mb-3">
              <p>
                <span class="font-medium">Company:</span>
                {{ enquiry.company }}
              </p>
              <p>
                <span class="font-medium">Phone:</span>
                {{ enquiry.phone }}
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
            <div class="flex items-center gap-2 text-xs">
              <span class="font-medium text-gray-600">Status:</span>
              <Select
                v-model="enquiry.status"
                :options="['pending', 'contacted', 'resolved']"
                class="w-full text-xs"
                @change="updateStatus(enquiry)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enquiry Detail Dialog -->
    <Dialog
      v-model:visible="detailsVisible"
      header="Enquiry Details"
      :style="{ width: isMobile ? '90vw' : '600px', maxWidth: '600px' }"
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
          <span :class="['status-badge', selectedEnquiry.status]">
            {{ selectedEnquiry.status }}
          </span>
        </div>
      </div>

      <template #footer>
        <Button label="Close" text @click="detailsVisible = false" />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          text
          @click="
            () => {
              detailsVisible = false;
              confirmDelete(selectedEnquiry);
            }
          "
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const enquiries = ref([]);
const loading = ref(false);
const selectedStatus = ref('all');
const detailsVisible = ref(false);
const selectedEnquiry = ref(null);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 640;
};

onBeforeMount(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch enquiries',
      life: 3000,
    });
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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update status',
      life: 3000,
    });
    fetchEnquiries();
  }
};

const viewEnquiry = (enquiry) => {
  selectedEnquiry.value = enquiry;
  detailsVisible.value = true;
};

const confirmDelete = (enquiry) => {
  confirm.require({
    message: `Delete enquiry from ${enquiry.name}? This action cannot be undone.`,
    header: 'Delete Enquiry',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    accept: () => deleteEnquiry(enquiry),
  });
};

const deleteEnquiry = async (enquiry) => {
  try {
    const response = await api.delete(`/admin/enquiries/${enquiry.id}`);
    if (response.data.success) {
      enquiries.value = enquiries.value.filter((e) => e.id !== enquiry.id);
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Enquiry removed', life: 2000 });
      if (detailsVisible.value && selectedEnquiry.value?.id === enquiry.id) {
        detailsVisible.value = false;
      }
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete enquiry',
      life: 3000,
    });
  }
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
