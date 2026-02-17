<template>
  <div class="enquiries-management">
    <div class="filters">
      <Dropdown 
        v-model="selectedStatus" 
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Filter by status"
        @change="fetchEnquiries"
      />
    </div>

    <DataTable 
      :value="enquiries" 
      :loading="loading"
      paginator 
      :rows="15"
      class="admin-table"
    >
      <Column field="name" header="Name" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="company" header="Company" />
      <Column field="phone" header="Phone" />
      <Column field="product_name" header="Product Interest" />
      <Column field="status" header="Status" style="width: 140px">
        <template #body="{ data }">
          <Dropdown 
            v-model="data.status" 
            :options="['pending', 'contacted', 'resolved']"
            @change="updateStatus(data)"
            class="status-dropdown"
          />
        </template>
      </Column>
      <Column field="created_at" header="Date" sortable>
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>
      <Column header="Actions" style="width: 100px">
        <template #body="{ data }">
          <Button 
            icon="pi pi-eye" 
            class="p-button-sm p-button-text"
            @click="viewEnquiry(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Enquiry Details Dialog -->
    <Dialog 
      v-model:visible="detailsDialogVisible" 
      header="Enquiry Details"
      :style="{ width: '600px' }"
      modal
    >
      <div v-if="selectedEnquiry" class="enquiry-details">
        <div class="detail-row">
          <strong>Name:</strong>
          <span>{{ selectedEnquiry.name }}</span>
        </div>
        <div class="detail-row">
          <strong>Email:</strong>
          <span>{{ selectedEnquiry.email }}</span>
        </div>
        <div class="detail-row">
          <strong>Company:</strong>
          <span>{{ selectedEnquiry.company || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <strong>Phone:</strong>
          <span>{{ selectedEnquiry.phone || 'N/A' }}</span>
        </div>
        <div class="detail-row">
          <strong>Product Interest:</strong>
          <span>{{ selectedEnquiry.product_name || 'General Enquiry' }}</span>
        </div>
        <div class="detail-row">
          <strong>Date:</strong>
          <span>{{ formatDate(selectedEnquiry.created_at) }}</span>
        </div>
        <div class="detail-row message-row">
          <strong>Message:</strong>
          <p>{{ selectedEnquiry.message }}</p>
        </div>
        <div class="detail-row">
          <strong>Status:</strong>
          <span :class="['status-badge', selectedEnquiry.status]">
            {{ selectedEnquiry.status }}
          </span>
        </div>
      </div>

      <template #footer>
        <Button label="Close" class="p-button-text" @click="detailsDialogVisible = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import api from '@/services/api'

const toast = useToast()

const enquiries = ref([])
const loading = ref(false)
const selectedStatus = ref('all')
const detailsDialogVisible = ref(false)
const selectedEnquiry = ref(null)

const statusOptions = [
  { label: 'All Enquiries', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Resolved', value: 'resolved' }
]

const fetchEnquiries = async () => {
  loading.value = true
  try {
    const url = selectedStatus.value === 'all' 
      ? '/admin/enquiries'
      : `/admin/enquiries?status=${selectedStatus.value}`
    
    const response = await api.get(url)
    
    if (response.data.success) {
      enquiries.value = response.data.data
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch enquiries', life: 3000 })
  } finally {
    loading.value = false
  }
}

const updateStatus = async (enquiry) => {
  try {
    const response = await api.patch(`/admin/enquiries/${enquiry.id}`, {
      status: enquiry.status
    })
    
    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Status updated', life: 2000 })
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status', life: 3000 })
    fetchEnquiries() // Revert on error
  }
}

const viewEnquiry = (enquiry) => {
  selectedEnquiry.value = enquiry
  detailsDialogVisible.value = true
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchEnquiries()
})
</script>

<style scoped>
.filters {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
}

.status-dropdown {
  width: 100%;
}

.enquiry-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
}

.detail-row strong {
  min-width: 140px;
  color: var(--color-text);
}

.detail-row span {
  color: var(--color-text);
  opacity: 0.85;
}

.message-row {
  flex-direction: column;
  gap: 0.5rem;
}

.message-row p {
  background-color: var(--color-canvas);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin: 0;
  line-height: 1.6;
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
