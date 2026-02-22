<template>
  <div>
    <div class="flex justify-end mb-5">
      <Button
        label="Add New Category"
        icon="pi pi-plus"
        @click="openDialog()"
        class="w-full sm:w-auto"
      />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
        <DataTable :value="categories" :loading="loading">
          <Column field="name" header="Category Name" sortable />
          <Column field="slug" header="Slug" sortable />
          <Column field="description" header="Description" />
          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button icon="pi pi-pencil" text size="small" @click="openDialog(data)" />
                <Button
                  icon="pi pi-trash"
                  text
                  size="small"
                  severity="danger"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Mobile Card View -->
      <div class="sm:hidden">
        <div v-if="loading" class="p-4">
          <p class="text-center text-gray-500">Loading...</p>
        </div>
        <div v-else-if="categories.length === 0" class="p-4">
          <p class="text-center text-gray-500">No categories found</p>
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="p-4 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-800 text-sm flex-1">{{ cat.name }}</h3>
              <div class="flex gap-1">
                <Button icon="pi pi-pencil" text size="small" @click="openDialog(cat)" />
                <Button
                  icon="pi pi-trash"
                  text
                  size="small"
                  severity="danger"
                  @click="confirmDelete(cat)"
                />
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-600">
              <p>
                <span class="font-medium">Slug:</span>
                {{ cat.slug }}
              </p>
              <p v-if="cat.description" class="text-gray-700">{{ cat.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingCategory ? 'Edit Category' : 'Add Category'"
      :style="{ width: isMobile ? '90vw' : '500px', maxWidth: '500px' }"
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
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';

const toast = useToast();
const confirm = useConfirm();

const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingCategory = ref(null);
const saving = ref(false);
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

const formData = ref({ name: '', slug: '', description: '' });

const fetchCategories = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admin/categories');
    if (response.data.success) categories.value = response.data.data;
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch categories',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const openDialog = (category = null) => {
  if (category) {
    editingCategory.value = category;
    formData.value = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    };
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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save category',
      life: 3000,
    });
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
      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Category deleted',
        life: 3000,
      });
      fetchCategories();
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete category',
      life: 3000,
    });
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
