import { storeToRefs } from "pinia";

import { useAuthStore } from "@/stores/auth.store";

import type { LoginRequest } from "@/types/auth";

export function useAuth() {
  const authStore = useAuthStore();

  const { user, loading, isAuthenticated, initialized } =
    storeToRefs(authStore);

  async function login(credentials: LoginRequest) {
    return authStore.login(credentials);
  }

  function logout() {
    authStore.logout();
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    initialized,
  };
}
