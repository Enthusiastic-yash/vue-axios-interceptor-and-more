<template>
    <main>
        <h1>
            Welcome,
            {{ user?.firstName }}
        </h1>

        <p>
            You are authenticated.
        </p>

        <button @click="handleLogout">
            Logout
        </button>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/composable/useAuth';

const { user, logout } = useAuth()
const router = useRouter();

function handleLogout() {
    logout();
    router.push({ name: "login" })
}


</script>

<style scoped></style>