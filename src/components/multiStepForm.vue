<template>
    <Form ref="myForm" :validation-schema="currentSchema" :keep-values="true"
        @submit="(values) => handleFinalSubmit(values as FormValues)" v-slot="{ validate, values }">
        <div class="steps-indicator">
            <span v-for="n in totalStep" :key="n" :class="{ active: n == currentStep }">{{ n }}</span>
        </div>

        <Transition name="slide" mode="out-in">
            <div :key="currentStep">
                <PersonalInfo v-if="currentStep === 1" />
                <Address v-if="currentStep === 2" />
                <Payment v-if="currentStep === 3" />
            </div>
        </Transition>

        <button v-if="currentStep > 1" type="button" @click="currentStep--">Back</button>
        <button v-if="currentStep < totalStep" type="button" @click="handleNext(validate, values)">Next</button>
        <button v-if="currentStep === totalStep" type="submit">Submit</button>
    </Form>
</template>

<script setup lang="ts">
import { Form } from "vee-validate"
import { step1Schema, step2Schema, fullSchema } from "@/schema/formSchema"
import { toTypedSchema } from "@vee-validate/zod"
import { ref, computed, onMounted } from "vue"
import type { FormValues } from "@/schema/formSchema"
import PersonalInfo from "./personalInfo.vue"
import Address from "./address.vue"
import Payment from "./payment.vue"

const currentStep = ref(1)
const totalStep = ref(3)
const STORAGE_KEY = 'multiStepFormProgress'
const myForm = ref<InstanceType<typeof Form> | null>(null)
const stepSchema = [toTypedSchema(step1Schema), toTypedSchema(step2Schema), toTypedSchema(fullSchema)]

const currentSchema = computed(() => stepSchema[currentStep.value - 1])


async function handleNext(validate: () => Promise<any>, values: Partial<FormValues>) {
    const result = await validate();
    if (result.valid) {
        currentStep.value++;
        saveProgress(values)
    }
}


onMounted(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
        try {
            const parsed = JSON.parse(saved) as { currentStep: number, formValues: Partial<FormValues> }
            currentStep.value = parsed.currentStep || 1
            myForm.value?.setValues(parsed.formValues || {})
        } catch (e) {
            console.error('Failed to restore form progress', e)
            sessionStorage.removeItem(STORAGE_KEY)
        }
    }
})


function saveProgress(values: Partial<FormValues>) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStep: currentStep.value,
        formValues: values
    }))
}

function handleFinalSubmit(values: FormValues) {

    console.log('Complete form data', values)
    sessionStorage.removeItem(STORAGE_KEY)
}

</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateX(100px);
}
</style>