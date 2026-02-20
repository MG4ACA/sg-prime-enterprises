<template>
  <div>
    <div class="flex justify-end mb-5">
      <Button label="Add New Category" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <DataTable :value="categories" :loading="loading">
        <Column field="name" header="Category Name" sortable />
        <Column field="slug" header="Slug" sortable />
        <Column field="description" header="Description" />
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

    <!-- Category Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingCategory ? 'Edit Category' : 'Add Category'"
      :style="{ width: '500px' }"
      modal
    >
      <form @submit.prevent="saveCategory" class="flex flex-col gap-4 pt-2">
        <div class="form-field">
          <label>Category Name *</label>
          <InputText v-model="formData.name" required class="w-full" />
        </div>

        <div class="form-field">
          <label>Slug *</label>
          <InputText v-model="formData.slug" required class="w-full" />
          <small class="text-gray-400 text-xs">URL-friendly name (e.g., erosion-control)</small>
        </div>

        <div class="form-field">
          <label>Description</label>
          <Textarea v-model="formData.description" rows="4" class="w-full" />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <Button label="Cancel" text @click="dialogVisible = false" type="button" />
          <Button label="Save Category" type="submit" :loading="saving" />
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

const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingCategory = ref(null);
const saving = ref(false);

const formData = ref({ name: '', slug: '', description: '' });

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/categories');
    if (response.data.success) categories.value = response.data.data;
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const openDialog = (category = null) => {
  if (category) {
    editingCategory.value = category;
    formData.value = { name: category.name, slug: category.slug, description: category.description || '' };
  } else {
    editingCategory.value = null;
    formData.value = { name: '', slug: '', description: '' };
  }
  dialogVisible.value = true;
};

const saveCategory = async () => {
  saving.value = true;
  try {
    const response = editingCategory.value
      ? await api.put(`/admin/categories/${editingCategory.value.id}`, formData.value)
      : await api.post('/admin/categories', formData.value);

    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Category saved', life: 3000 });
      dialogVisible.value = false;
      fetchCategories();
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save category', life: 3000 });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (category) => {
  confirm.require({
    message: `Are you sure you want to delete "${category.name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptSeverity: 'danger',
    accept: () => deleteCategory(category.id),
  });
};

const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`);
    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Deleted', detail: 'Category deleted', life: 3000 });
      fetchCategories();
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 });
  }
};

onMounted(fetchCategories);
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
</style>
