<script setup>
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const showEnquiryDialog = ref(false);
const submitting = ref(false);

const enquiryForm = reactive({ name: '', email: '', phone: '', company: '', message: '' });

const specsArray = computed(() => {
  if (!product.value?.specs) return [];
  const s = product.value.specs;
  return typeof s === 'object' ? Object.entries(s) : [];
});

const fetchProduct = async () => {
  loading.value = true;
  try {
    const [productRes, relatedRes] = await Promise.all([
      api.get(`/products/${route.params.id}`),
      api.get('/products?status=active&limit=4'),
    ]);

    if (productRes.data.success) {
      product.value = productRes.data.data;
    } else {
      router.push('/products');
    }

    if (relatedRes.data.success) {
      relatedProducts.value = relatedRes.data.data
        .filter((p) => p.id !== Number(route.params.id))
        .slice(0, 3);
    }
  } catch {
    router.push('/products');
  } finally {
    loading.value = false;
  }
};

const submitEnquiry = async () => {
  if (!enquiryForm.name || !enquiryForm.email) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Fields',
      detail: 'Name and email are required.',
      life: 3000,
    });
    return;
  }
  submitting.value = true;
  try {
    await api.post('/enquiry', {
      ...enquiryForm,
      product_id: product.value.id,
      product_name: product.value.name,
    });
    toast.add({
      severity: 'success',
      summary: 'Quote Requested!',
      detail: "We'll get back to you shortly.",
      life: 5000,
    });
    showEnquiryDialog.value = false;
    Object.keys(enquiryForm).forEach((k) => (enquiryForm[k] = ''));
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to submit. Please try again.',
      life: 4000,
    });
  } finally {
    submitting.value = false;
  }
};

watch(() => route.params.id, fetchProduct);
onMounted(fetchProduct);
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="loading" class="min-h-96 flex items-center justify-center bg-cream">
    <div class="flex flex-col items-center gap-3 text-bark-400">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
      <p class="text-sm">Loading product…</p>
    </div>
  </div>

  <div v-else-if="product">
    <!-- Product Main Section -->
    <section class="py-12 pt-28 bg-cream">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image -->
          <div class="rounded-2xl overflow-hidden bg-white shadow-md aspect-[4/3]">
            <img
              :src="
                product.image_url ||
                'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80'
              "
              :alt="product.name"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <!-- Info -->
          <div class="flex flex-col justify-center">
            <RouterLink
              v-if="product.category_slug"
              :to="`/category/${product.category_slug}`"
              class="badge bg-earth-50 text-earth-600 border border-earth-200 w-fit mb-4 hover:bg-earth-100 transition-colors"
            >
              {{ product.category_name }}
            </RouterLink>
            <span
              v-else
              class="badge bg-earth-50 text-earth-600 border border-earth-200 w-fit mb-4"
            >
              {{ product.category_name }}
            </span>

            <h1 class="font-display font-bold text-bark-800 text-3xl md:text-4xl mb-5">
              {{ product.name }}
            </h1>

            <p class="text-bark-600 leading-relaxed mb-8 text-base">
              {{ product.description }}
            </p>

            <div class="flex flex-wrap gap-3">
              <button @click="showEnquiryDialog = true" class="btn-primary gap-2">
                <i class="pi pi-send"></i>
                Request Quote
              </button>
              <RouterLink to="/contact" class="btn-secondary gap-2">
                <i class="pi pi-phone"></i>
                Contact Us
              </RouterLink>
            </div>

            <!-- Trust badges -->
            <div class="flex flex-wrap gap-4 mt-8 pt-8 border-t border-coir-100">
              <div class="flex items-center gap-2 text-sm text-bark-500">
                <i class="pi pi-check-circle text-earth-500"></i>
                Certified Quality
              </div>
              <div class="flex items-center gap-2 text-sm text-bark-500">
                <i class="pi pi-leaf text-earth-500"></i>
                100% Natural
              </div>
              <div class="flex items-center gap-2 text-sm text-bark-500">
                <i class="pi pi-globe text-earth-500"></i>
                Export Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Specifications -->
    <section v-if="specsArray.length > 0" class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-display font-bold text-bark-800 text-2xl md:text-3xl mb-8">
          Technical Specifications
        </h2>
        <div class="max-w-3xl rounded-2xl overflow-hidden border border-coir-100">
          <div
            v-for="([key, value], i) in specsArray"
            :key="key"
            :class="[
              'flex divide-x divide-coir-100 text-sm',
              i % 2 === 0 ? 'bg-cream' : 'bg-white',
            ]"
          >
            <div class="px-6 py-3 w-48 font-semibold text-bark-700 shrink-0">{{ key }}</div>
            <div class="px-6 py-3 text-bark-600">{{ value }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products -->
    <section v-if="relatedProducts.length > 0" class="py-14 bg-cream">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="font-display font-bold text-bark-800 text-2xl md:text-3xl mb-8">
          You May Also Like
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="rp in relatedProducts"
            :key="rp.id"
            @click="router.push(`/products/${rp.id}`)"
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-coir-100 card-hover group cursor-pointer"
          >
            <div class="h-44 overflow-hidden">
              <img
                :src="
                  rp.image_url ||
                  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80'
                "
                :alt="rp.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-4">
              <h3 class="font-display font-semibold text-bark-800 text-base mb-1">{{ rp.name }}</h3>
              <span class="text-earth-600 text-sm font-medium flex items-center gap-1">
                View Details
                <i class="pi pi-arrow-right text-xs"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Request Quote Dialog -->
  <Dialog
    v-model:visible="showEnquiryDialog"
    header="Request a Quote"
    :style="{ width: '520px' }"
    modal
  >
    <form @submit.prevent="submitEnquiry" class="flex flex-col gap-4 pt-2">
      <div class="form-field">
        <label>Product</label>
        <InputText :value="product?.name" disabled class="w-full bg-gray-50" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="form-field">
          <label>Your Name *</label>
          <InputText v-model="enquiryForm.name" placeholder="John Doe" required class="w-full" />
        </div>
        <div class="form-field">
          <label>Email *</label>
          <InputText
            v-model="enquiryForm.email"
            placeholder="john@company.com"
            required
            class="w-full"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="form-field">
          <label>Phone</label>
          <InputText v-model="enquiryForm.phone" placeholder="+1 234 567 8900" class="w-full" />
        </div>
        <div class="form-field">
          <label>Company</label>
          <InputText v-model="enquiryForm.company" placeholder="Company name" class="w-full" />
        </div>
      </div>
      <div class="form-field">
        <label>Message</label>
        <Textarea
          v-model="enquiryForm.message"
          rows="4"
          placeholder="Tell us about your requirements…"
          class="w-full"
        />
      </div>
      <div class="flex justify-end gap-3 pt-1">
        <Button label="Cancel" text type="button" @click="showEnquiryDialog = false" />
        <Button label="Submit Request" type="submit" :loading="submitting" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a3328;
}
</style>
