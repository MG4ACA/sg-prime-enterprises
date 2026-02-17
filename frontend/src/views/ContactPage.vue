<template>
  <div class="contact-page">
    <NavBar />

    <section class="page-hero">
      <div class="container">
        <h1>Get in Touch</h1>
        <p>Have questions? We're here to help</p>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-layout">
          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <p class="form-intro">Fill out the form below and we'll get back to you within 24 hours.</p>
            
            <form @submit.prevent="submitEnquiry" class="contact-form">
              <div class="form-row">
                <div class="form-field">
                  <label>Your Name *</label>
                  <InputText v-model="form.name" placeholder="John Doe" required />
                </div>
                <div class="form-field">
                  <label>Email Address *</label>
                  <InputText v-model="form.email" type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label>Company</label>
                  <InputText v-model="form.company" placeholder="Your Company Ltd" />
                </div>
                <div class="form-field">
                  <label>Phone Number</label>
                  <InputText v-model="form.phone" placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div class="form-field">
                <label>Message *</label>
                <Textarea 
                  v-model="form.message" 
                  rows="6"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button 
                type="submit"
                label="Send Message" 
                icon="pi pi-send"
                class="btn-primary btn-large"
                :loading="submitting"
              />
            </form>
          </div>

          <!-- Contact Info -->
          <div class="contact-info-wrapper">
            <h2>Contact Information</h2>
            
            <div class="info-blocks">
              <div class="info-block">
                <div class="info-icon">
                  <i class="pi pi-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>contact@sgprimeenterprises.com</p>
                <p>sales@sgprimeenterprises.com</p>
              </div>

              <div class="info-block">
                <div class="info-icon">
                  <i class="pi pi-phone"></i>
                </div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9am - 6pm EST</p>
              </div>

              <div class="info-block">
                <div class="info-icon">
                  <i class="pi pi-map-marker"></i>
                </div>
                <h3>Office</h3>
                <p>123 Industrial Avenue</p>
                <p>Business District, City 12345</p>
                <p>Country</p>
              </div>

              <div class="info-block">
                <div class="info-icon">
                  <i class="pi pi-clock"></i>
                </div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div class="social-section">
              <h3>Follow Us</h3>
              <div class="social-links">
                <a href="#" aria-label="Facebook"><i class="pi pi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i class="pi pi-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="pi pi-linkedin"></i></a>
                <a href="#" aria-label="Twitter"><i class="pi pi-twitter"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import api from '@/services/api'

const toast = useToast()

const form = ref({
  name: '',
  email: '',
  company: '',
  phone: '',
  message: ''
})

const submitting = ref(false)

const submitEnquiry = async () => {
  submitting.value = true
  
  try {
    const response = await api.post('/enquiry', form.value)
    
    if (response.data.success) {
      toast.add({
        severity: 'success',
        summary: 'Message Sent!',
        detail: 'Thank you for contacting us. We will get back to you soon.',
        life: 5000
      })
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to send message. Please try again.',
      life: 3000
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding-top: 70px;
}

.page-hero {
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 4rem;
}

.page-hero h1 {
  color: white;
  margin-bottom: 1rem;
}

.page-hero p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
}

.contact-section {
  padding: 0 0 4rem;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
}

.contact-form-wrapper h2,
.contact-info-wrapper h2 {
  margin-bottom: 1rem;
}

.form-intro {
  color: var(--color-text);
  opacity: 0.75;
  margin-bottom: 2rem;
}

.contact-form {
  background-color: white;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-field label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.95rem;
}

.btn-large {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  margin-top: 1rem;
}

.info-blocks {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.info-block {
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-medium);
}

.info-block:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.info-icon {
  width: 50px;
  height: 50px;
  background-color: var(--color-brand);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.info-icon i {
  font-size: 1.5rem;
  color: white;
}

.info-block h3 {
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.info-block p {
  color: var(--color-text);
  opacity: 0.75;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.social-section {
  background-color: var(--color-canvas);
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
}

.social-section h3 {
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  color: var(--color-brand);
  transition: all var(--transition-medium);
  box-shadow: var(--shadow-sm);
}

.social-links a:hover {
  background-color: var(--color-brand);
  color: white;
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.social-links i {
  font-size: 1.25rem;
}

@media (max-width: 968px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: 1.5rem;
  }
}
</style>
