<!-- Step1PersonalInfo.vue -->
<template>
    <div>
        <label>Full Name</label>
        <Field name="fullName" />
        <ErrorMessage name="fullName" class="error" />

        <label>Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
</script>