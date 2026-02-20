<template>
  <div class="admin-login">
    <div class="login-card">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="mx-auto w-14 h-14 rounded-full bg-earth-600 flex items-center justify-center mb-4">
          <i class="pi pi-leaf text-white text-2xl"></i>
        </div>
        <h1 class="font-display font-bold text-bark-800 text-2xl">SG Prime Enterprises</h1>
        <p class="text-bark-500 text-sm mt-1">Admin Portal</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-bark-700">Username</label>
          <InputText
            v-model="credentials.username"
            placeholder="Enter username"
            autocomplete="username"
            required
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-bark-700">Password</label>
          <InputText
            v-model="credentials.password"
            type="password"
            placeholder="Enter password"
            autocomplete="current-password"
            required
            class="w-full"
          />
        </div>

        <Button
          type="submit"
          label="Sign In"
          icon="pi pi-sign-in"
          class="w-full mt-1"
          :loading="loading"
        />

        <p v-if="errorMessage" class="text-center text-sm text-red-600 bg-red-50 rounded-lg py-2 px-3">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const credentials = ref({ username: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  const result = await authStore.login(credentials.value);
  loading.value = false;

  if (result.success) {
    toast.add({ severity: 'success', summary: 'Welcome!', detail: 'Login successful', life: 2000 });
    router.push('/admin/dashboard');
  } else {
    errorMessage.value = result.message || 'Invalid credentials';
  }
};
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2a452f 0%, #4A7C59 100%);
  padding: 2rem;
}

.login-card {
  background-color: white;
  border-radius: 1.25rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}
</style>
