<template>
  <div class="change-password-page">
    <div class="card-container">
      <div class="card">
        <div class="card-header">
          <div class="icon-wrap">
            <i class="pi pi-lock"></i>
          </div>
          <h2>Change Password</h2>
          <p>Enter your current password and choose a new one.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <!-- Current Password -->
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <Password
              id="currentPassword"
              v-model="form.currentPassword"
              :feedback="false"
              toggleMask
              inputClass="w-full"
              fluid
              placeholder="Enter current password"
            />
            <small v-if="errors.currentPassword" class="error-msg">
              {{ errors.currentPassword }}
            </small>
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <Password
              id="newPassword"
              v-model="form.newPassword"
              toggleMask
              inputClass="w-full"
              fluid
              placeholder="At least 8 characters"
              :promptLabel="'Choose a password'"
              :weakLabel="'Too simple'"
              :mediumLabel="'Average complexity'"
              :strongLabel="'Complex password'"
            />
            <small v-if="errors.newPassword" class="error-msg">{{ errors.newPassword }}</small>
          </div>

          <!-- Confirm New Password -->
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <Password
              id="confirmPassword"
              v-model="form.confirmPassword"
              :feedback="false"
              toggleMask
              inputClass="w-full"
              fluid
              placeholder="Repeat new password"
            />
            <small v-if="errors.confirmPassword" class="error-msg">
              {{ errors.confirmPassword }}
            </small>
          </div>

          <Button
            type="submit"
            label="Update Password"
            icon="pi pi-check"
            :loading="loading"
            class="submit-btn"
            fluid
          />
        </form>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const validate = () => {
  let valid = true;
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (!form.currentPassword) {
    errors.currentPassword = 'Current password is required.';
    valid = false;
  }

  if (!form.newPassword) {
    errors.newPassword = 'New password is required.';
    valid = false;
  } else if (form.newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters.';
    valid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
    valid = false;
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
    valid = false;
  }

  if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword) {
    errors.newPassword = 'New password must differ from the current password.';
    valid = false;
  }

  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  const result = await authStore.changePassword(form.currentPassword, form.newPassword);
  loading.value = false;

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Password Updated',
      detail: result.message,
      life: 3000,
    });
    form.currentPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 4000,
    });
  }
};
</script>

<style scoped>
.change-password-page {
  padding: 2rem;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.card-container {
  width: 100%;
  max-width: 460px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #2a452f 0%, #3d6849 100%);
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  color: white;
}

.icon-wrap {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.icon-wrap i {
  font-size: 1.5rem;
}

.card-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.card-header p {
  font-size: 0.875rem;
  opacity: 0.75;
  margin: 0;
}

.form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
}

.submit-btn {
  margin-top: 0.5rem;
  background: #2a452f;
  border-color: #2a452f;
}

.submit-btn:hover {
  background: #3d6849 !important;
  border-color: #3d6849 !important;
}
</style>
