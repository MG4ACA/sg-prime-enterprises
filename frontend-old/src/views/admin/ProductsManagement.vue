<template>
  <div class="products-management">
    <div class="page-actions">
      <Button label="Add New Product" icon="pi pi-plus" class="btn-primary" @click="openDialog()" />
    </div>

    <DataTable :value="products" :loading="loading" paginator :rows="10" class="admin-table">
      <Column field="image_url" header="Image" style="width: 100px">
        <template #body="{ data }">
          <img
            :src="data.image_url || 'https://via.placeholder.com/80'"
            :alt="data.name"
            class="product-thumb"
          />
        </template>
      </Column>
      <Column field="name" header="Product Name" sortable />
      <Column field="category_name" header="Category" sortable />
      <Column field="is_featured" header="Featured" style="width: 100px">
        <template #body="{ data }">
          <i
            :class="data.is_featured ? 'pi pi-star-fill' : 'pi pi-star'"
            :style="{ color: data.is_featured ? '#fbbf24' : '#ccc' }"
          ></i>
        </template>
      </Column>
      <Column field="status" header="Status" style="width: 120px">
        <template #body="{ data }">
          <span :class="['status-badge', data.status]">{{ data.status }}</span>
        </template>
      </Column>
      <Column header="Actions" style="width: 160px">
        <template #body="{ data }">
          <div class="action-buttons">
            <Button
              icon="pi pi-pencil"
              class="p-button-sm p-button-text"
              @click="openDialog(data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-sm p-button-text p-button-danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Product Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingProduct ? 'Edit Product' : 'Add Product'"
      :style="{ width: '650px' }"
      modal
    >
      <form @submit.prevent="saveProduct" class="product-form">
        <div class="form-field">
          <label>Product Name *</label>
          <InputText v-model="formData.name" required />
        </div>

        <div class="form-field">
          <label>Category *</label>
          <Dropdown
            v-model="formData.category_id"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Select a category"
            required
          />
        </div>

        <div class="form-field">
          <label>Description *</label>
          <Textarea v-model="formData.description" rows="4" required />
        </div>

        <div class="form-field">
          <label>Specifications (JSON)</label>
          <Textarea
            v-model="formData.specs"
            rows="6"
            placeholder='{"Material": "Natural Coir Fiber", "Size": "2m x 50m"}'
          />
        </div>

        <div class="form-field">
          <label>Product Image</label>
          <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput" />
        </div>

        <div class="form-row">
          <div class="form-field checkbox-field">
            <label>
              <input type="checkbox" v-model="formData.is_featured" />
              Featured Product
            </label>
          </div>

          <div class="form-field">
            <label>Status</label>
            <Dropdown
              v-model="formData.status"
              :options="statusOptions"
              placeholder="Select status"
            />
          </div>
        </div>

        <div class="form-field">
          <label>Display Order</label>
          <InputText v-model.number="formData.display_order" type="number" />
        </div>

        <div class="dialog-actions">
          <Button
            label="Cancel"
            class="p-button-text"
            @click="dialogVisible = false"
            type="button"
          />
          <Button label="Save" class="btn-primary" type="submit" :loading="saving" />
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

const formData = ref({
  name: '',
  category_id: null,
  description: '',
  specs: '',
  is_featured: false,
  status: 'active',
  display_order: 0,
});

const selectedFile = ref(null);

const statusOptions = ['active', 'inactive'];

const fetchData = async () => {
  loading.value = true;
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/categories'),
    ]);

    if (productsRes.data.success) products.value = productsRes.data.data;
    if (categoriesRes.data.success) categories.value = categoriesRes.data.data;
  } catch (error) {
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
      specs:
        typeof product.specs === 'object' ? JSON.stringify(product.specs, null, 2) : product.specs,
      is_featured: !!product.is_featured,
      status: product.status,
      display_order: product.display_order || 0,
    };
  } else {
    editingProduct.value = null;
    formData.value = {
      name: '',
      category_id: null,
      description: '',
      specs: '',
      is_featured: false,
      status: 'active',
      display_order: 0,
    };
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
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.value.name);
    formDataToSend.append('category_id', formData.value.category_id);
    formDataToSend.append('description', formData.value.description);
    formDataToSend.append('specs', formData.value.specs);
    formDataToSend.append('is_featured', formData.value.is_featured ? '1' : '0');
    formDataToSend.append('status', formData.value.status);
    formDataToSend.append('display_order', formData.value.display_order);

    if (selectedFile.value) {
      formDataToSend.append('image', selectedFile.value);
    }

    let response;
    if (editingProduct.value) {
      response = await api.put(`/admin/products/${editingProduct.value.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await api.post('/admin/products', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product saved successfully',
        life: 3000,
      });
      dialogVisible.value = false;
      fetchData();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save product',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (product) => {
  confirm.require({
    message: `Are you sure you want to delete "${product.name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteProduct(product.id),
  });
};

const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);

    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Product deleted', life: 3000 });
      fetchData();
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete product',
      life: 3000,
    });
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page-actions {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 600;
  font-size: 0.95rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.checkbox-field label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-field input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
