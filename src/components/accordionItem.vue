<template>
    <div>
        <div class="accordion-item">
            <button class="header" @click="ctx.toggle(id)">
                {{ title }}
                <span>{{ open ? '▲' : '▼' }}</span>
            </button>

            <div v-if="open" class="content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { ACCORDION_KEY } from '@/types/accordion';

const props = defineProps<{
    id: string;
    title: string;
}>()

const ctx = inject(ACCORDION_KEY);


if (!ctx) {
    throw new Error('<AccordionItem> must be used inside <Accordion>')
}

const open = computed(() => ctx.isOpen(props.id))


</script>

<style scoped>
.accordion-item {
    max-width: 500px;
    border: 2px solid #ddd;
    margin: 8px;
}

.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background: #f5f5f5;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.content {
    padding: 12px;
}
</style>