<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <h1>SG Prime Enterprises</h1>
          <p>Admin Portal</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-field">
            <label>Username</label>
            <InputText 
              v-model="credentials.username" 
              placeholder="Enter username"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-field">
            <label>Password</label>
            <InputText 
              v-model="credentials.password" 
              type="password"
              placeholder="Enter password"
              autocomplete="current-password"
              required
            />
          </div>

          <Button 
            type="submit"
            label="Sign In" 
            icon="pi pi-sign-in"
            class="btn-primary btn-block"
            :loading="loading"
          />

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const credentials = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(credentials.value)
    
    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: 'Login successful',
      life: 2000
    })
    
    router.push('/admin/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand), var(--color-secondary));
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background-color: white;
  border-radius: var(--radius-xl);
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.logo-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-section h1 {
  color: var(--color-brand);
  margin-bottom: 0.5rem;
}

.logo-section p {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 1.125rem;
}

.login-form {
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
}

.btn-block {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  margin-top: 0.5rem;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin-top: -0.5rem;
  font-size: 0.95rem;
}
</style>
