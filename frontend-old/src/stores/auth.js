import api from '@/services/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || null);
  const user = ref(null);
  const isAuthenticated = ref(!!token.value);

  const login = async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);

      if (response.data.success) {
        token.value = response.data.data.token;
        user.value = {
          username: response.data.data.username,
          role: response.data.data.role,
        };
        isAuthenticated.value = true;

        localStorage.setItem('admin_token', token.value);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('admin_token');
  };

  const verifyToken = async () => {
    if (!token.value) {
      return false;
    }

    try {
      const response = await api.get('/admin/verify');
      if (response.data.success) {
        user.value = response.data.data;
        isAuthenticated.value = true;
        return true;
      }
    } catch (error) {
      logout();
      return false;
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    verifyToken,
  };
});
