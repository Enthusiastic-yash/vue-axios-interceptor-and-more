import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";

import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashBoard.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.restoreSession();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: "login",
    };
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return {
      name: "dashboard",
    };
  }

  return true;
});

export default router;
