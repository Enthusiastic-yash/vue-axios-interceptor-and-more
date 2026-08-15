<script setup lang="ts">
import { ref } from "vue";

import { useAuth } from "@/composable/useAuth";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("emilys");
const password = ref("emilyspass");
const errorMessage = ref("");

const {
    login,
    loading,
    user,
    isAuthenticated,
} = useAuth();

async function handleLogin() {
    errorMessage.value = "";
    try {
        await login({
            username: username.value,
            password: password.value,
        });

        await router.push({ name: "dashboard" })

    } catch (error) {
        errorMessage.value = "Invalid username or Password"
    }
}
</script>

<template>
    <div>
        <h1>Login</h1>

        <input v-model="username" placeholder="Username" />

        <input v-model="password" type="password" placeholder="Password" />

        <button :disabled="loading" @click="handleLogin">
            {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p v-if="errorMessage">
            {{ errorMessage }}
        </p>
    </div>
</template>