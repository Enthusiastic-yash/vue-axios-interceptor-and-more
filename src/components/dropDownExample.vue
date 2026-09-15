<template>
    <div>
        <div style="display: flex; gap: 30px; flex-wrap: wrap; margin-bottom: 24px;">
            <div>
                <h3>New drop down</h3>
                <newDropDown :options="fruitOptions" v-model="selectedNewFruit" :multiple="true"
                    placeholder="please select any one value" />
                <p> selected model value : {{ selectedNewFruit }}</p>

            </div>

            <!-- 1. Single Select with Object -->
            <div>
                <h3>1. Single Select (Objects)</h3>
                <dropDown v-model="selectedFruit" :options="fruitOptions" placeholder="Select a fruit" />
                <p><strong>Selected:</strong> {{ selectedFruit }}</p>
            </div>

            <!-- 2. Multi Select with Objects -->
            <div>
                <h3>2. Multi Select (Objects)</h3>
                <dropDown v-model="selectedMultipleFruits" :options="fruitOptions" placeholder="Select multiple fruits"
                    :multiple="true" />
                <p><strong>Selected:</strong> {{ selectedMultipleFruits }}</p>
            </div>

            <!-- 3. Multi Select with Simple Primitives (Strings) -->
            <div>
                <h3>3. Multi Select (Simple Strings)</h3>
                <dropDown v-model="selectedColors" :options="colorOptions" placeholder="Select colors"
                    :multiple="true" />
                <p><strong>Selected:</strong> {{ selectedColors }}</p>
            </div>

            <!-- 4. Form Validation with VeeValidate -->
            <div class="validation-demo-box">
                <h3>4. VeeValidate Validated Form</h3>
                <Form :validation-schema="demoSchema" @submit="onDemoSubmit" class="demo-form">
                    <div>
                        <label style="display: block; font-weight: bold; margin-bottom: 6px;">Favorite Fruit
                            (Required)</label>
                        <dropDown name="fruit" :options="fruitOptions" placeholder="Choose a fruit..." />
                    </div>

                    <div style="margin-top: 12px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 6px;">Favorite Colors (Pick at
                            least 1)</label>
                        <dropDown name="colors" :options="colorOptions" placeholder="Choose colors..."
                            :multiple="true" />
                    </div>

                    <button type="submit"
                        style="margin-top: 16px; padding: 8px 16px; cursor: pointer; border-radius: 6px; background: #000; color: #fff; border: none;">
                        Submit Validated Form
                    </button>
                    <p v-if="submittedData" style="color: green; margin-top: 8px;">Form submitted successfully! Check
                        console.</p>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { DropdownOption } from '@/types/dropdown';
import newDropDown from './newDropDown.vue';
import dropDown from './dropDown.vue';
import { Form } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';


interface Fruit {
    id: number
    name: string
}
const fruitOptions: DropdownOption<Fruit>[] = [
    {
        id: 1,
        label: 'Apple',
        value: { id: 1, name: 'apple' },
        disabled: false
    },
    {
        id: 2,
        label: 'Banana',
        value: { id: 2, name: 'banana' },
        disabled: true
    },
    {
        id: 3,
        label: 'Cherry',
        value: { id: 3, name: 'cherry' },
        disabled: false
    },
    {
        id: 4,
        label: 'kiwi',
        value: { id: 4, name: 'kiwi' },
        disabled: false
    },
    {
        id: 5,
        label: 'Mango',
        value: { id: 5, name: 'mango' },
        disabled: false
    },
]
const selectedFruit = ref<Fruit | null>(null)
const selectedMultipleFruits = ref<Fruit[]>([])
const selectedColors = ref<string[]>([])
const selectedNewFruit = ref<Fruit | null>(null)


const colorOptions: DropdownOption<string>[] = [
    { id: 1, label: 'Red', value: 'red', disabled: false },
    { id: 2, label: 'Green', value: 'green', disabled: false },
    { id: 3, label: 'Blue', value: 'blue', disabled: false },
    { id: 4, label: 'Yellow (Disabled)', value: 'yellow', disabled: true },
    { id: 5, label: 'Orange', value: 'orange', disabled: false },
    { id: 6, label: 'sky blue', value: 'sky blue', disabled: false },
    { id: 7, label: 'black', value: 'black', disabled: false },
]


const submittedData = ref<any>(null);

const demoSchema = toTypedSchema(
    z.object({
        fruit: z
            .object({ id: z.number(), name: z.string() })
            .nullish()
            .refine((val) => Boolean(val), "Please select a fruit"),
        colors: z
            .array(z.string())
            .min(1, "Please select at least 1 color")
    })
);

function onDemoSubmit(values: any) {
    console.log("Form validated & submitted successfully:", values);
    submittedData.value = values;
}
</script>

<style scoped>
.validation-demo-box {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    background-color: #fafafa;
    min-width: 280px;
}
</style>