<template>
    <div>
        <label>Address</label>
        <Field name="address" />
        <ErrorMessage name="address" class="error" />

        <label>City</label>
        <Field name="city" />
        <ErrorMessage name="city" class="error" />

        <label>Country</label>
        <Field name="country" as="select">
            <option value="">---Select----</option>
            <option value="US">US</option>
            <option value="Uk">Uk</option>
            <option value="In">In</option>
            <option value="Ca">Ca</option>

        </Field>
        <ErrorMessage name="country" class="error" />
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

</script>

<style scoped></style>