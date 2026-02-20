<template>
  <div class="product-detail-page">
    <NavBar />

    <div v-if="loading" class="loading-container">
      <div class="loading"></div>
    </div>

    <div v-else-if="product" class="product-detail">
      <!-- Breadcrumb -->
      <div class="container">
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <i class="pi pi-angle-right"></i>
          <router-link to="/products">Products</router-link>
          <i class="pi pi-angle-right"></i>
          <span>{{ product.name }}</span>
        </div>
      </div>

      <!-- Product Content -->
      <section class="product-content">
        <div class="container">
          <div class="product-layout">
            <!-- Image Section with Zoom -->
            <div class="product-image-section">
              <div
                class="product-image-container"
                ref="imageContainer"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              >
                <img
                  ref="productImage"
                  :src="
                    product.image_url ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
                  "
                  :alt="product.name"
                  class="product-image"
                />
              </div>
            </div>

            <!-- Product Info -->
            <div class="product-info-section" ref="infoSection">
              <div class="product-category">
                <router-link :to="`/category/${product.category_slug}`">
                  {{ product.category_name }}
                </router-link>
              </div>
              <h1>{{ product.name }}</h1>
              <div class="product-description">
                <p>{{ product.description }}</p>
              </div>

              <!-- Action Buttons -->
              <div class="product-actions">
                <Button
                  label="Request Quote"
                  icon="pi pi-send"
                  class="btn-primary btn-large"
                  @click="openEnquiryForm"
                />
                <Button
                  label="Download Specs"
                  icon="pi pi-download"
                  class="btn-secondary btn-large"
                  @click="downloadSpecs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Specifications Table -->
      <section class="specifications-section" ref="specsSection">
        <div class="container">
          <div class="section-header">
            <h2>Technical Specifications</h2>
          </div>

          <div class="specs-table" ref="specsTable">
            <div v-for="(value, key) in product.specs" :key="key" class="spec-row">
              <div class="spec-label">{{ key }}</div>
              <div class="spec-value">{{ value }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" class="related-section">
        <div class="container">
          <div class="section-header">
            <h2>Related Products</h2>
          </div>

          <div class="related-grid">
            <div
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              class="product-card"
              @click="viewProduct(relatedProduct.id)"
            >
              <div class="product-image">
                <img
                  :src="
                    relatedProduct.image_url ||
                    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
                  "
                  :alt="relatedProduct.name"
                />
              </div>
              <div class="product-info">
                <h3>{{ relatedProduct.name }}</h3>
                <span class="view-link">
                  View Details
                  <i class="pi pi-arrow-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer />

    <!-- Enquiry Dialog -->
    <Dialog
      v-model:visible="showEnquiryDialog"
      header="Request Quote"
      :style="{ width: '500px' }"
      :modal="true"
    >
      <div class="enquiry-form">
        <div class="form-field">
          <label>Product</label>
          <InputText v-model="product.name" disabled />
        </div>
        <div class="form-field">
          <label>Your Name *</label>
          <InputText v-model="enquiryForm.name" placeholder="John Doe" />
        </div>
        <div class="form-field">
          <label>Email *</label>
          <InputText v-model="enquiryForm.email" placeholder="john@company.com" />
        </div>
        <div class="form-field">
          <label>Company</label>
          <InputText v-model="enquiryForm.company" placeholder="Your Company Ltd" />
        </div>
        <div class="form-field">
          <label>Phone</label>
          <InputText v-model="enquiryForm.phone" placeholder="+1 234 567 8900" />
        </div>
        <div class="form-field">
          <label>Message *</label>
          <Textarea
            v-model="enquiryForm.message"
            rows="4"
            placeholder="Tell us about your requirements..."
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="btn-secondary" @click="showEnquiryDialog = false" />
        <Button
          label="Send Enquiry"
          class="btn-primary"
          @click="submitEnquiry"
          :loading="submitting"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Footer from '@/components/Footer.vue';
import NavBar from '@/components/NavBar.vue';
import { useGSAP } from '@/composables/useGSAP';
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const showEnquiryDialog = ref(false);
const submitting = ref(false);

const imageContainer = ref(null);
const productImage = ref(null);
const infoSection = ref(null);
const specsSection = ref(null);
const specsTable = ref(null);

const enquiryForm = ref({
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
});

const { fadeIn, gsap } = useGSAP();

// Image zoom effect
const handleMouseMove = (e) => {
  if (!productImage.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  gsap.to(productImage.value, {
    scale: 1.5,
    transformOrigin: `${x}% ${y}%`,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleMouseLeave = () => {
  gsap.to(productImage.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

// Fetch product data
const fetchProduct = async () => {
  try {
    const response = await api.get(`/products/${route.params.id}`);
    if (response.data.success) {
      product.value = response.data.data;
      fetchRelatedProducts();
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load product details',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const fetchRelatedProducts = async () => {
  try {
    const response = await api.get(
      `/products?category=${product.value.category_slug}&status=active`,
    );
    if (response.data.success) {
      relatedProducts.value = response.data.data
        .filter((p) => p.id !== product.value.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Failed to fetch related products:', error);
  }
};

const viewProduct = (id) => {
  router.push(`/products/${id}`);
  window.scrollTo(0, 0);
  fetchProduct();
};

const openEnquiryForm = () => {
  showEnquiryDialog.value = true;
  enquiryForm.value.message = `I'm interested in ${product.value.name}. Please provide more information.`;
};

const submitEnquiry = async () => {
  // Validation
  if (!enquiryForm.value.name || !enquiryForm.value.email || !enquiryForm.value.message) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000,
    });
    return;
  }

  submitting.value = true;
  try {
    const response = await api.post('/enquiry', {
      ...enquiryForm.value,
      product_id: product.value.id,
    });

    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Your enquiry has been sent successfully!',
        life: 5000,
      });
      showEnquiryDialog.value = false;
      enquiryForm.value = { name: '', email: '', company: '', phone: '', message: '' };
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to submit enquiry',
      life: 3000,
    });
  } finally {
    submitting.value = false;
  }
};

const downloadSpecs = () => {
  const specsText = JSON.stringify(product.value.specs, null, 2);
  const blob = new Blob([specsText], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${product.value.name.replace(/\s+/g, '-')}-specs.json`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Initialize animations
const initAnimations = () => {
  fadeIn(infoSection.value, { y: 30, duration: 0.8 });

  // Specs table slide in from bottom
  gsap.from(specsTable.value, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: specsSection.value,
      start: 'top 70%',
    },
  });

  // Stagger spec rows
  gsap.from('.spec-row', {
    x: -30,
    opacity: 0,
    stagger: 0.05,
    duration: 0.5,
    scrollTrigger: {
      trigger: specsTable.value,
      start: 'top 80%',
    },
  });
};

onMounted(async () => {
  await fetchProduct();
  setTimeout(() => {
    if (product.value) {
      initAnimations();
    }
  }, 100);
});
</script>

<style scoped>
.product-detail-page {
  padding-top: 70px;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 0 1rem;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--color-brand);
}

.breadcrumb i {
  color: var(--color-text);
  opacity: 0.5;
  font-size: 0.75rem;
}

.breadcrumb span {
  color: var(--color-text);
  opacity: 0.7;
}

.product-content {
  padding: 2rem 0;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  cursor: zoom-in;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-section {
  position: sticky;
  top: 100px;
}

.product-category {
  margin-bottom: 1rem;
}

.product-category a {
  display: inline-block;
  color: var(--color-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-info-section h1 {
  margin-bottom: 1.5rem;
}

.product-description {
  margin-bottom: 2rem;
  line-height: 1.8;
}

.product-description p {
  color: var(--color-text);
  opacity: 0.85;
  font-size: 1.05rem;
}

.product-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-large {
  padding: 1rem 2rem;
}

.specifications-section {
  padding: 4rem 0;
  background-color: white;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.specs-table {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.spec-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  border-bottom: 1px solid rgba(154, 90, 46, 0.1);
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-label,
.spec-value {
  padding: 1.25rem 1.5rem;
}

.spec-label {
  background-color: var(--color-canvas);
  font-weight: 600;
  color: var(--color-brand);
}

.spec-value {
  color: var(--color-text);
}

.related-section {
  padding: 4rem 0;
  background-color: var(--color-canvas);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.product-card {
  background-color: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-medium);
  box-shadow: var(--shadow-sm);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.product-card .product-image {
  height: 200px;
}

.product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-card .product-info {
  padding: 1.5rem;
}

.product-card h3 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.view-link {
  color: var(--color-brand);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Enquiry Form */
.enquiry-form {
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
  color: var(--color-text);
  font-size: 0.95rem;
}

@media (max-width: 968px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-info-section {
    position: static;
  }

  .product-image-container {
    height: 400px;
  }

  .specs-table {
    font-size: 0.9rem;
  }

  .spec-row {
    grid-template-columns: 1fr;
  }

  .spec-label {
    border-bottom: 1px solid rgba(154, 90, 46, 0.1);
  }
}
</style>
