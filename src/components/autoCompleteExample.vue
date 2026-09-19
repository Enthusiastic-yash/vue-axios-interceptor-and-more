<template>
    <div>
        <h2>Autocomplete Searchbox</h2>
        <autoComplete :fetchOption="fetchUsers" :debounceTime="300"
            :getOptionLabel="(option: User) => option.firstName + ' ' + option.lastName" placeholder="Search users..."
            @select="handleSelectOption">
            <template #option="{ option }">
                <img :src="option.image" style="width:40px; height:40px">
                {{ option.firstName }}
            </template>
        </autoComplete>
    </div>
</template>

<script setup lang="ts">
import autoComplete from "./autoComplete.vue";
import { userService } from "@/services/userService"
import type { User } from "@/types/user"


const fetchUsers = async (query: string, signal: AbortSignal) => {
    return await userService.searchQuery(query, signal);
}

function handleSelectOption(selectedUser: User) {
    console.log("Selected User:", selectedUser);
}

</script>

<style scoped></style>