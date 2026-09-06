<template>
    <div>
        <label>card</label>
        <Field name="cardNumber" />
        <ErrorMessage name="cardNumber" class="error" />
        <label>
            <Field name="saveCard" type="checkbox" :value="true" />
            Save this card for future
        </label>
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from "vee-validate"

</script>

<style scoped></style>