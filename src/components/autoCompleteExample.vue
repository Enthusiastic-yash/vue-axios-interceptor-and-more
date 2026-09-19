<template>
    <div style="display: flex; gap: 20px;">
        <div>
            <h2>Autocomplete Searchbox</h2>
            <autoComplete :fetchOption="fetchUsers" :debounceTime="300"
                :getOptionLabel="(option: User) => option.firstName + ' ' + option.lastName"
                placeholder="Search users..." @select="handleSelectOption">
                <template #option="{ option }">
                    <img :src="option.image" style="width:40px; height:40px">
                    {{ option.firstName }}
                </template>
            </autoComplete>
        </div>
        <div>
            <h2>Autocomplete Country</h2>
            <autoComplete :fetchOption="fetchCountry" :debounceTime="300"
                :getOptionLabel="(option: CountryResponse) => option.name" placeholder="Search country..."
                @select="handleSelectCountry">
                <template #option="{ option }">
                    <img :src="option.flags.png" style="width:40px; height:40px">
                    {{ option.name }}
                </template>
            </autoComplete>
        </div>
    </div>
</template>

<script setup lang="ts">
import autoComplete from "./autoComplete.vue";
import { userService } from "@/services/userService"
import { countryServices } from "@/services/countryService"
import type { User } from "@/types/user"
import type { CountryResponse } from "@/types/country"


const fetchUsers = async (query: string, signal: AbortSignal) => {
    return await userService.searchQuery(query, signal);
}

const fetchCountry = async (query: string, signal: AbortSignal) => {
    return await countryServices.getCountry(query, signal);
}

function handleSelectOption(selectedUser: User) {
    console.log("Selected User:", selectedUser);
}

function handleSelectCountry(selectedCountry: CountryResponse) {
    console.log("Selected Country:", selectedCountry);
}


</script>

<style scoped></style>