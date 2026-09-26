<template>
    <div class="accordion">
        <slot />
    </div>


</template>

<script setup lang="ts">
import { provide } from 'vue';
import { ACCORDION_KEY } from '@/types/accordion';
const props = withDefaults(defineProps<{
    modelValue: string[]
    multiple?: boolean;
}>(), {
    modelValue: () => [],
    multiple: false
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
}>()

function isOpen(id: string) {
    return props.modelValue.includes(id)
}

function toggle(id: string): void {
    if (isOpen(id)) {
        emit('update:modelValue', props.modelValue.filter((x) => x !== id))
    } else {
        const next = props.multiple ? [...props.modelValue, id] : [id]
        emit('update:modelValue', next)
    }
}

provide(ACCORDION_KEY, { isOpen, toggle })


</script>

<style scoped>
.accordion {
    max-width: 520px;
    border: 1px solid #ddd;
    margin: 20px auto;
}
</style>