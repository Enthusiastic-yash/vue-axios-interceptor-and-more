import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import type { AuthUser, LoginRequest, LoginResponse } from "@/types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const loading = ref(false);
  const initialized = ref(false);

  const isAuthenticated = computed(() => user.value !== null);

  async function login(credentials: LoginRequest) {
    loading.value = true;
    try {
      user.value = await authService.login(credentials);
      return user.value;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  async function restoreSession() {
    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } catch {
      authService.logout();
      user.value = null;
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  }

  async function logout() {
    await authService.logout();
    user.value = null;
  }

  return {
    user,
    login,
    logout,
    loading,
    restoreSession,
    isAuthenticated,
    initialized,
  };
});
