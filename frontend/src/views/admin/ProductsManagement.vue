<template>
  <div>
    <div class="flex justify-end mb-5">
      <Button label="Add New Product" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <DataTable :value="products" :loading="loading" paginator :rows="10">
        <Column field="image_url" header="Image" style="width: 90px">
          <template #body="{ data }">
            <img
              :src="data.image_url || 'https://via.placeholder.com/80'"
              :alt="data.name"
              class="w-16 h-12 object-cover rounded"
            />
          </template>
        </Column>
        <Column field="name" header="Product Name" sortable />
        <Column field="category_name" header="Category" sortable />
        <Column field="is_featured" header="Featured" style="width: 90px">
          <template #body="{ data }">
            <i
              :class="data.is_featured ? 'pi pi-star-fill text-amber-400' : 'pi pi-star text-gray-300'"
            ></i>
          </template>
        </Column>
        <Column field="status" header="Status" style="width: 110px">
          <template #body="{ data }">
            <span :class="['status-badge', data.status]">{{ data.status }}</span>
          </template>
        </Column>
        <Column header="Actions" style="width: 120px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-pencil" text size="small" @click="openDialog(data)" />
              <Button icon="pi pi-trash" text size="small" severity="danger" @click="confirmDelete(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Product Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingProduct ? 'Edit Product' : 'Add Product'"
      :style="{ width: '650px' }"
      modal
    >
      <form @submit.prevent="saveProduct" class="flex flex-col gap-4 pt-2">
        <div class="form-field">
          <label>Product Name *</label>
          <InputText v-model="formData.name" required class="w-full" />
        </div>

        <div class="form-field">
          <label>Category *</label>
          <Select
            v-model="formData.category_id"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a category"
            class="w-full"
          />
        </div>

        <div class="form-field">
          <label>Description *</label>
          <Textarea v-model="formData.description" rows="4" required class="w-full" />
        </div>

        <div class="form-field">
          <label>Specifications (JSON)</label>
          <Textarea
            v-model="formData.specs"
            rows="5"
            placeholder='{"Material": "Natural Coir Fiber", "Size": "2m x 50m"}'
            class="w-full"
          />
        </div>

        <div class="form-field">
          <label>Product Image</label>
          <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput" class="text-sm" />
        </div>

        <div class="flex gap-4">
          <div class="form-field flex-1">
            <label>Status</label>
            <Select v-model="formData.status" :options="statusOptions" class="w-full" />
          </div>
          <div class="form-field flex-1">
            <label>Display Order</label>
            <InputText v-model.number="formData.display_order" type="number" class="w-full" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="formData.is_featured" id="featured" />
          <label for="featured" class="text-sm font-medium cursor-pointer">Featured Product</label>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <Button label="Cancel" text @click="dialogVisible = false" type="button" />
          <Button label="Save Product" type="submit" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import api from '@/services/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingProduct = ref(null);
const saving = ref(false);
const fileInput = ref(null);
const selectedFile = ref(null);

const statusOptions = ['active', 'inactive'];

const formData = ref({
  name: '',
  category_id: null,
  description: '',
  specs: '',
  is_featured: false,
  status: 'active',
  display_order: 0,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/categories'),
    ]);
    if (productsRes.data.success) products.value = productsRes.data.data;
    if (categoriesRes.data.success) categories.value = categoriesRes.data.data;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const openDialog = (product = null) => {
  if (product) {
    editingProduct.value = product;
    formData.value = {
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      specs: typeof product.specs === 'object' ? JSON.stringify(product.specs, null, 2) : product.specs,
      is_featured: !!product.is_featured,
      status: product.status,
      display_order: product.display_order || 0,
    };
  } else {
    editingProduct.value = null;
    formData.value = { name: '', category_id: null, description: '', specs: '', is_featured: false, status: 'active', display_order: 0 };
  }
  selectedFile.value = null;
  dialogVisible.value = true;
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const saveProduct = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append('name', formData.value.name);
    fd.append('category_id', formData.value.category_id);
    fd.append('description', formData.value.description);
    fd.append('specs', formData.value.specs);
    fd.append('is_featured', formData.value.is_featured ? '1' : '0');
    fd.append('status', formData.value.status);
    fd.append('display_order', formData.value.display_order);
    if (selectedFile.value) fd.append('image', selectedFile.value);

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = editingProduct.value
      ? await api.put(`/admin/products/${editingProduct.value.id}`, fd, config)
      : await api.post('/admin/products', fd, config);

    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Product saved', life: 3000 });
      dialogVisible.value = false;
      fetchData();
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product', life: 3000 });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (product) => {
  confirm.require({
    message: `Are you sure you want to delete "${product.name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptSeverity: 'danger',
    accept: () => deleteProduct(product.id),
  });
};

const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);
    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted', life: 3000 });
      fetchData();
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
  }
};

onMounted(fetchData);
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}
.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status-badge.active   { background: #dcfce7; color: #16a34a; }
.status-badge.inactive { background: #f3f4f6; color: #6b7280; }
</style>
