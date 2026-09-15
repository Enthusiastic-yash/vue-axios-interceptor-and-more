<template>
    <div class="address-step">
        <div class="form-group">
            <label for="address">Address</label>
            <Field id="address" name="address" />
            <ErrorMessage name="address" class="error" />
        </div>

        <div class="form-group">
            <label for="city">City</label>
            <Field id="city" name="city" />
            <ErrorMessage name="city" class="error" />
        </div>

        <div class="form-group">
            <label>Country</label>
            <!-- Custom Dropdown with VeeValidate integration -->
            <!-- <dropDown name="country" :options="countryOptions" placeholder="Select a country..." /> -->
            <newDropDown :options="countryOptions" v-model="countryValue" :error-message="countryError"
                :multiple="false" placeholder="Select a country" />

        </div>

        {{ countryValue }}

    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import dropDown from './dropDown.vue';
import type { DropdownOption } from '@/types/dropdown';
import newDropDown from './newDropDown.vue';
import { useField } from 'vee-validate';


const { value: countryValue, errorMessage: countryError } = useField<Country[] | null>('country', undefined, {
    initialValue: [],
    syncVModel: false,
});


interface Country {
    code: string;
    name: string;
}

const countryOptions: DropdownOption<Country>[] = [
    { id: 1, label: 'United States', value: { code: 'US', name: 'United States' }, disabled: false },
    { id: 2, label: 'United Kingdom', value: { code: 'UK', name: 'United Kingdom' }, disabled: false },
    { id: 3, label: 'India', value: { code: 'IN', name: 'India' }, disabled: false },
    { id: 4, label: 'Canada', value: { code: 'CA', name: 'Canada' }, disabled: false },
    { id: 5, label: 'Australia', value: { code: 'AU', name: 'Australia' }, disabled: false },
];



</script>

<style scoped>
.address-step {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.error {
    color: #dc2626;
    font-size: 12px;
}
</style>