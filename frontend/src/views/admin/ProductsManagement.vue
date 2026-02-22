<template>
  <div>
    <!-- Main Content Header -->
    <div class="flex flex-row justify-between items-center gap-3 mb-5">
      <div class="flex gap-2">
        <Button
          icon="pi pi-refresh"
          text
          rounded
          @click="fetchData"
          v-tooltip="'Refresh products list'"
        />
      </div>
      <Button label="Add New Product" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
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
                :class="
                  data.is_featured ? 'pi pi-star-fill text-amber-400' : 'pi pi-star text-gray-300'
                "
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
        <div v-else-if="products.length === 0" class="p-4">
          <p class="text-center text-gray-500">No products found</p>
        </div>
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="product in products"
            :key="product.id"
            class="p-4 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex gap-3 mb-2">
              <img
                :src="product.image_url || 'https://via.placeholder.com/80'"
                :alt="product.name"
                class="w-16 h-12 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 text-sm truncate">{{ product.name }}</h3>
                <p class="text-xs text-gray-500">{{ product.category_name }}</p>
                <div class="flex gap-2 mt-1">
                  <span :class="['status-badge text-xs', product.status]">
                    {{ product.status }}
                  </span>
                  <i v-if="product.is_featured" class="pi pi-star-fill text-amber-400 text-sm"></i>
                </div>
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <Button icon="pi pi-pencil" text size="small" @click="openDialog(product)" />
              <Button
                icon="pi pi-trash"
                text
                size="small"
                severity="danger"
                @click="confirmDelete(product)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="editingProduct ? 'Edit Product' : 'Add Product'"
      :style="{ width: isMobile ? '90vw' : '650px', maxWidth: '650px' }"
      modal
      :contentStyle="{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '85vh' }"
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
          <label>
            Product Images
            <span class="text-gray-400 font-normal text-xs ml-1">(up to 5 · first = primary)</span>
          </label>

          <!-- Existing images (edit mode) -->
          <div v-if="existingImages.length > 0" class="mb-3">
            <p class="text-xs text-gray-500 mb-2">
              Saved images — click ★ to make primary, ✕ to delete
            </p>
            <div class="flex flex-wrap gap-2">
              <div v-for="img in existingImages" :key="img.id" class="relative group">
                <img
                  :src="img.image_url"
                  :alt="'product image'"
                  class="h-20 w-24 object-cover rounded-lg border-2 transition-colors"
                  :class="img.is_primary ? 'border-amber-400 shadow-sm' : 'border-gray-200'"
                />
                <!-- Primary badge -->
                <span
                  v-if="img.is_primary"
                  class="absolute bottom-1 left-1 bg-amber-400 text-white text-xs px-1 rounded leading-tight"
                >
                  Primary
                </span>
                <!-- Controls (hover) -->
                <div
                  class="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1"
                >
                  <button
                    v-if="!img.is_primary"
                    type="button"
                    @click="setExistingImagePrimary(img)"
                    class="w-7 h-7 bg-amber-400 text-white rounded-full text-xs flex items-center justify-center hover:bg-amber-500 transition-colors"
                    title="Set as primary"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    @click="deleteExistingImage(img)"
                    class="w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Delete image"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- New image previews -->
          <div v-if="newImagePreviews.length > 0" class="mb-3">
            <p class="text-xs text-gray-500 mb-2">
              New images to upload
              <span v-if="existingImages.length === 0" class="text-amber-600">
                (first will be primary)
              </span>
            </p>
            <div class="flex flex-wrap gap-2">
              <div v-for="(preview, index) in newImagePreviews" :key="index" class="relative group">
                <img
                  :src="preview"
                  :alt="'new image ' + (index + 1)"
                  class="h-20 w-24 object-cover rounded-lg border-2 transition-colors"
                  :class="
                    index === 0 && existingImages.length === 0
                      ? 'border-amber-400'
                      : 'border-gray-200'
                  "
                />
                <span
                  v-if="index === 0 && existingImages.length === 0"
                  class="absolute bottom-1 left-1 bg-amber-400 text-white text-xs px-1 rounded leading-tight"
                >
                  Primary
                </span>
                <button
                  type="button"
                  @click="removeNewImage(index)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Drop zone (shown when under limit) -->
          <div
            v-if="totalImageCount < 5"
            class="upload-zone"
            :class="{ 'drag-over': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput.click()"
          >
            <i class="pi pi-images text-2xl text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-500">
              <span class="text-blue-500 font-medium">Click to browse</span>
              or drag &amp; drop
            </p>
            <p class="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP — max 5 MB each · {{ 5 - totalImageCount }} slot(s) remaining
            </p>
          </div>
          <div v-else class="text-xs text-amber-600 mt-1">
            Maximum of 5 images reached. Delete an existing image to add a new one.
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            class="hidden"
            @change="handleFileChange"
          />
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

        <div class="flex justify-between gap-3 pt-2">
          <Button
            label="Populate Sample Data"
            icon="pi pi-fw pi-refresh"
            text
            severity="info"
            @click="populateSampleData"
            type="button"
          />
          <div class="flex gap-3">
            <Button label="Cancel" text @click="dialogVisible = false" type="button" />
            <Button label="Save Product" type="submit" :loading="saving" />
          </div>
        </div>
      </form>
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

const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 640;
};

onBeforeMount(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

const dialogVisible = ref(false);
const editingProduct = ref(null);
const saving = ref(false);
const fileInput = ref(null);
/** Files queued for upload (not yet saved) */
const selectedFiles = ref([]);
/** Object-URL previews matching selectedFiles */
const newImagePreviews = ref([]);
/** Images already saved in the DB (edit mode) */
const existingImages = ref([]);
const isDragging = ref(false);

/** Total image count across saved + queued */
const totalImageCount = computed(() => existingImages.value.length + selectedFiles.value.length);

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

const openDialog = async (product = null) => {
  selectedFiles.value = [];
  newImagePreviews.value = [];
  existingImages.value = [];

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

    // Load full images list for the product
    try {
      const res = await api.get(`/products/${product.id}`);
      if (res.data.success && res.data.data.images) {
        existingImages.value = res.data.data.images;
      }
    } catch {
      // Fallback: show just the primary image_url if available
      if (product.image_url) {
        existingImages.value = [{ id: null, image_url: product.image_url, is_primary: true }];
      }
    }
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

  dialogVisible.value = true;
};

/** Add files from file-picker or drop event, respecting the max-5 limit */
const addFiles = (fileList) => {
  const remaining = 5 - totalImageCount.value;
  if (remaining <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Limit reached',
      detail: 'Maximum 5 images per product.',
      life: 3000,
    });
    return;
  }

  const toAdd = Array.from(fileList)
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, remaining);

  toAdd.forEach((file) => {
    selectedFiles.value.push(file);
    newImagePreviews.value.push(URL.createObjectURL(file));
  });
};

const handleFileChange = (event) => {
  addFiles(event.target.files);
  // Reset so the same file can be re-selected if needed
  if (fileInput.value) fileInput.value.value = '';
};

const handleDrop = (event) => {
  isDragging.value = false;
  addFiles(event.dataTransfer.files);
};

/** Remove a queued (not-yet-saved) image by index */
const removeNewImage = (index) => {
  URL.revokeObjectURL(newImagePreviews.value[index]);
  selectedFiles.value.splice(index, 1);
  newImagePreviews.value.splice(index, 1);
};

/** Delete a saved image via API */
const deleteExistingImage = async (img) => {
  if (!editingProduct.value || !img.id) return;
  try {
    await api.delete(`/admin/products/${editingProduct.value.id}/images/${img.id}`);
    existingImages.value = existingImages.value.filter((i) => i.id !== img.id);
    // Refresh the list to get updated is_primary flags
    const res = await api.get(`/products/${editingProduct.value.id}`);
    if (res.data.success) existingImages.value = res.data.data.images || [];
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Image removed', life: 2000 });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete image',
      life: 3000,
    });
  }
};

/** Set a saved image as the primary via API */
const setExistingImagePrimary = async (img) => {
  if (!editingProduct.value || !img.id) return;
  try {
    await api.patch(`/admin/products/${editingProduct.value.id}/images/${img.id}/primary`);
    // Refresh is_primary flags locally
    existingImages.value = existingImages.value.map((i) => ({
      ...i,
      is_primary: i.id === img.id,
    }));
    toast.add({ severity: 'success', summary: 'Updated', detail: 'Primary image set', life: 2000 });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update primary image',
      life: 3000,
    });
  }
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

    // Append all queued image files under the 'images' field name
    selectedFiles.value.forEach((file) => fd.append('images', file));

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
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete product',
      life: 3000,
    });
  }
};

const populateSampleData = () => {
  const sample = {
    name: 'Premium Coir Fiber Roll',
    description:
      'High-quality natural coir fiber ideal for industrial and agricultural applications.',
    category_id: 1,
    specs: JSON.stringify({
      Material: 'Natural Coir Fiber',
      Size: '2m x 50m',
      Density: 'High',
      Origin: 'Sri Lanka',
    }),
    is_featured: true,
    status: 'active',
    display_order: 1,
  };

  formData.value = {
    name: sample.name,
    category_id: sample.category_id,
    description: sample.description,
    specs: sample.specs,
    is_featured: sample.is_featured,
    status: sample.status,
    display_order: sample.display_order,
  };

  toast.add({
    severity: 'info',
    summary: 'Sample Data Loaded',
    detail: 'Sample product data has been populated in the form',
    life: 3000,
  });
};

onMounted(fetchData);

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
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
.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}
.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #4a7c59;
  background-color: #f0faf4;
}
</style>
