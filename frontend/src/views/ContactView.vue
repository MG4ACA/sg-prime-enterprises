<script setup>
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

const toast = useToast();

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  category: '',
  message: '',
});

const submitting = ref(false);
const submitted = ref(false);

const subjectOptions = [
  { label: 'Product Enquiry', value: 'Product Enquiry' },
  { label: 'Bulk / Wholesale Order', value: 'Bulk / Wholesale Order' },
  { label: 'Custom Manufacturing', value: 'Custom Manufacturing' },
  { label: 'Export & Shipping', value: 'Export & Shipping' },
  { label: 'Sample Request', value: 'Sample Request' },
  { label: 'General Question', value: 'General Question' },
];

const categoryOptions = [
  { label: 'Erosion Control', value: 'Erosion Control' },
  { label: 'Greenhouse Products', value: 'Greenhouse Products' },
  { label: 'Gardening Products', value: 'Gardening Products' },
  { label: 'Multiple Categories', value: 'Multiple Categories' },
];

function handleSubmit() {
  if (!form.name || !form.email || !form.message) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Fields',
      detail: 'Please fill in your name, email and message.',
      life: 4000,
    });
    return;
  }
  submitting.value = true;
  // Simulate API call
  setTimeout(() => {
    submitting.value = false;
    submitted.value = true;
    toast.add({
      severity: 'success',
      summary: 'Message Sent!',
      detail: "Thank you. We'll get back to you within 1 business day.",
      life: 6000,
    });
  }, 1500);
}

function resetForm() {
  Object.keys(form).forEach((k) => (form[k] = ''));
  submitted.value = false;
}

const contactInfo = [
  {
    icon: 'pi pi-map-marker',
    title: 'Visit Us',
    lines: ['42 Coir Industrial Park', 'Alappuzha, Kerala 688001', 'India'],
    color: 'text-earth-500',
    bg: 'bg-earth-50',
  },
  {
    icon: 'pi pi-phone',
    title: 'Call Us',
    lines: ['+91 477 225 0000', '+91 477 225 0001', 'Mon – Sat, 9:00 AM – 6:00 PM'],
    color: 'text-coir-600',
    bg: 'bg-coir-50',
  },
  {
    icon: 'pi pi-envelope',
    title: 'Email Us',
    lines: ['info@sgprimeenterprises.com', 'exports@sgprimeenterprises.com'],
    color: 'text-bark-600',
    bg: 'bg-bark-50',
  },
  {
    icon: 'pi pi-clock',
    title: 'Business Hours',
    lines: ['Monday – Saturday:', '9:00 AM to 6:00 PM IST', 'Sunday: Closed'],
    color: 'text-earth-600',
    bg: 'bg-earth-50',
  },
];
</script>

<template>
  <!-- Page Hero -->
  <section class="relative py-20 bg-bark-800 overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
      alt="Contact us"
      class="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
    />
    <div class="relative max-w-7xl mx-auto px-4 text-center">
      <span class="badge bg-earth-500/20 text-earth-400 mb-4">Contact</span>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-5">Get in Touch</h1>
      <p class="text-coir-300 text-lg max-w-xl mx-auto">
        Whether you have a question, want samples, or are ready to place an order — we'd love to
        hear from you.
      </p>
    </div>
  </section>

  <!-- Contact Info Cards -->
  <section class="py-14 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="info in contactInfo"
          :key="info.title"
          class="bg-white rounded-2xl p-6 border border-coir-100 shadow-sm card-hover"
        >
          <div :class="info.bg" class="w-11 h-11 rounded-xl flex items-center justify-center mb-4">
            <i :class="[info.icon, info.color]" class="text-lg"></i>
          </div>
          <h3 class="font-display font-semibold text-bark-800 mb-2">{{ info.title }}</h3>
          <div class="space-y-0.5">
            <p v-for="line in info.lines" :key="line" class="text-bark-500 text-sm">{{ line }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Form + Map -->
  <section class="pb-24 bg-cream">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-5 gap-10">
        <!-- Contact Form -->
        <div
          class="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 border border-coir-100 shadow-sm"
        >
          <!-- Success state -->
          <Transition name="fade" mode="out-in">
            <div v-if="submitted" key="success" class="text-center py-12">
              <div
                class="w-20 h-20 rounded-full bg-earth-100 flex items-center justify-center mx-auto mb-6"
              >
                <i class="pi pi-check-circle text-earth-500 text-4xl"></i>
              </div>
              <h2 class="font-display font-bold text-bark-800 text-2xl mb-3">Message Received!</h2>
              <p class="text-bark-500 mb-8">
                Our team will respond within 1 business day. Meanwhile, feel free to browse our
                product catalogue.
              </p>
              <button @click="resetForm" class="btn-secondary mr-4">Send Another</button>
              <a href="/products" class="btn-primary">View Products</a>
            </div>

            <!-- Form state -->
            <form v-else key="form" @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <span class="badge bg-earth-100 text-earth-600 mb-2">Send us a Message</span>
                <h2 class="font-display font-bold text-bark-800 text-2xl">Make an Enquiry</h2>
                <p class="text-bark-500 text-sm mt-1">All fields marked * are required.</p>
              </div>

              <!-- Row: Name + Company -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Full Name *</label>
                  <PInputText
                    v-model="form.name"
                    placeholder="E.g. John Smith"
                    class="w-full"
                    required
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Company / Organisation</label>
                  <PInputText
                    v-model="form.company"
                    placeholder="Your company name"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Row: Email + Phone -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Email Address *</label>
                  <PInputText
                    v-model="form.email"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full"
                    required
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Phone Number</label>
                  <PInputText
                    v-model="form.phone"
                    type="tel"
                    placeholder="+1 (555) 000 0000"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Row: Subject + Category -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Subject</label>
                  <PSelect
                    v-model="form.subject"
                    :options="subjectOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select a subject"
                    class="w-full"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-bark-700">Product Category</label>
                  <PSelect
                    v-model="form.category"
                    :options="categoryOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select category"
                    class="w-full"
                  />
                </div>
              </div>

              <!-- Message -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-bark-700">Message *</label>
                <PTextarea
                  v-model="form.message"
                  placeholder="Tell us about your project, quantities needed, or any questions you have..."
                  rows="5"
                  class="w-full resize-none"
                  required
                />
              </div>

              <PButton
                type="submit"
                :loading="submitting"
                :label="submitting ? 'Sending...' : 'Send Message'"
                icon="pi pi-send"
                class="w-full sm:w-auto bg-earth-500 border-earth-500 hover:bg-earth-600 hover:border-earth-600"
              />
            </form>
          </Transition>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Map placeholder -->
          <div
            class="rounded-2xl overflow-hidden shadow-sm border border-coir-100 aspect-video bg-coir-50 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
              alt="Map region"
              class="w-full h-full object-cover opacity-70"
            />
            <div
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bark-800/40"
            >
              <div
                class="w-12 h-12 rounded-full bg-earth-500 flex items-center justify-center shadow-lg"
              >
                <i class="pi pi-map-marker text-white text-xl"></i>
              </div>
              <p class="text-white font-semibold text-sm">Alappuzha, Kerala</p>
              <a
                href="https://www.google.com/maps?q=Alappuzha,Kerala,India"
                target="_blank"
                rel="noopener"
                class="btn-primary text-xs px-4 py-2 mt-1"
              >
                <i class="pi pi-external-link mr-1.5 text-xs"></i>
                Open in Maps
              </a>
            </div>
          </div>

          <!-- Social -->
          <div class="bg-white rounded-2xl p-7 border border-coir-100 shadow-sm">
            <h3 class="font-display font-semibold text-bark-800 text-lg mb-4">Follow Us</h3>
            <div class="flex flex-col gap-3">
              <a
                v-for="s in [
                  {
                    icon: 'pi pi-facebook',
                    label: 'Facebook',
                    handle: '@sgprimeenterprises',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    icon: 'pi pi-instagram',
                    label: 'Instagram',
                    handle: '@sgprime_coir',
                    color: 'text-pink-600',
                    bg: 'bg-pink-50',
                  },
                  {
                    icon: 'pi pi-linkedin',
                    label: 'LinkedIn',
                    handle: 'SG Prime Enterprises',
                    color: 'text-blue-700',
                    bg: 'bg-blue-50',
                  },
                ]"
                :key="s.label"
                href="#"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-coir-50 transition-colors group"
              >
                <div
                  :class="s.bg"
                  class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                >
                  <i :class="[s.icon, s.color]" class="text-base"></i>
                </div>
                <div>
                  <p class="text-sm font-medium text-bark-800">{{ s.label }}</p>
                  <p class="text-xs text-bark-400">{{ s.handle }}</p>
                </div>
                <i
                  class="pi pi-arrow-right ml-auto text-xs text-bark-300 group-hover:text-earth-500 transition-colors"
                ></i>
              </a>
            </div>
          </div>

          <!-- Quick facts -->
          <div class="bg-earth-500 rounded-2xl p-7 text-white">
            <h3 class="font-display font-semibold text-xl mb-5">Quick Response Guarantee</h3>
            <ul class="space-y-3 text-earth-100 text-sm">
              <li class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-earth-200 mt-0.5 shrink-0"></i>
                Reply within 24 hours on business days
              </li>
              <li class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-earth-200 mt-0.5 shrink-0"></i>
                Free product samples available on request
              </li>
              <li class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-earth-200 mt-0.5 shrink-0"></i>
                Custom spec quotations within 48 hours
              </li>
              <li class="flex items-start gap-2.5">
                <i class="pi pi-check-circle text-earth-200 mt-0.5 shrink-0"></i>
                Export documentation assistance available
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
