<template>
  <div class="categories-management">
    <div class="page-actions">
      <Button 
        label="Add New Category" 
        icon="pi pi-plus" 
        class="btn-primary"
        @click="openDialog()"
      />
    </div>

    <DataTable 
      :value="categories" 
      :loading="loading"
      class="admin-table"
    >
      <Column field="name" header="Category Name" sortable />
      <Column field="slug" header="Slug" sortable />
      <Column field="description" header="Description" />
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

    <!-- Category Dialog -->
    <Dialog 
      v-model:visible="dialogVisible" 
      :header="editingCategory ? 'Edit Category' : 'Add Category'"
      :style="{ width: '500px' }"
      modal
    >
      <form @submit.prevent="saveCategory" class="category-form">
        <div class="form-field">
          <label>Category Name *</label>
          <InputText v-model="formData.name" required />
        </div>

        <div class="form-field">
          <label>Slug *</label>
          <InputText v-model="formData.slug" required />
          <small>URL-friendly name (e.g., erosion-control)</small>
        </div>

        <div class="form-field">
          <label>Description</label>
          <Textarea v-model="formData.description" rows="4" />
        </div>

        <div class="dialog-actions">
          <Button label="Cancel" class="p-button-text" @click="dialogVisible = false" type="button" />
          <Button label="Save" class="btn-primary" type="submit" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import api from '@/services/api'

const toast = useToast()
const confirm = useConfirm()

const categories = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingCategory = ref(null)
const saving = ref(false)

const formData = ref({
  name: '',
  slug: '',
  description: ''
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/categories')
    
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch categories', life: 3000 })
  } finally {
    loading.value = false
  }
}

const openDialog = (category = null) => {
  if (category) {
    editingCategory.value = category
    formData.value = {
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    }
  } else {
    editingCategory.value = null
    formData.value = {
      name: '',
      slug: '',
      description: ''
    }
  }
  dialogVisible.value = true
}

const saveCategory = async () => {
  saving.value = true
  
  try {
    let response
    if (editingCategory.value) {
      response = await api.put(`/admin/categories/${editingCategory.value.id}`, formData.value)
    } else {
      response = await api.post('/admin/categories', formData.value)
    }

    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Category saved successfully', life: 3000 })
      dialogVisible.value = false
      fetchCategories()
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save category', life: 3000 })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (category) => {
  confirm.require({
    message: `Are you sure you want to delete "${category.name}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteCategory(category.id)
  })
}

const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`)
    
    if (response.data.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Category deleted', life: 3000 })
      fetchCategories()
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category', life: 3000 })
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.page-actions {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.category-form {
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

.form-field small {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.875rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
