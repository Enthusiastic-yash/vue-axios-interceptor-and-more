<template>
    <div class="dropdown" ref="dropdownRef">
        <button type="button" class="dropdown-trigger" @click="isOpen = !isOpen">
            {{ displayButtonText }}
        </button>

        <ul v-if="isOpen" class="dropdown-menu">
            <li v-for="option in options" :key="option.id"
                :class="{ selected: isSelected(option), disabled: option.disabled }" @click="selectOption(option)">
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" generic="T">
import type { DropdownOption } from '../types/dropdown';
import { ref, computed, onMounted, onBeforeUnmount } from "vue"

const props = defineProps<{
    options: DropdownOption<T>[];
    modelValue: T | null;
    placeholder?: string;
}>()

const isOpen = ref(false)
const emit = defineEmits<{
    'update:modelValue': [value: T | null]
}>()

const dropdownRef = ref<HTMLElement | null>(null)

function isMatch(val1: T | null, val2: T | null): boolean {
    if (val1 === val2) return true;
    if (val1 !== null && val2 !== null && typeof val1 === 'object' && typeof val2 === 'object') {
        return JSON.stringify(val1) === JSON.stringify(val2);
    }
    return false;
}

const selectedOption = computed(() =>
    props.options.find(opt => isMatch(opt.value, props.modelValue))
)

const displayButtonText = computed(() => {
    if (selectedOption.value) {
        return selectedOption.value.label ?? selectedOption.value.value;
    }
    return props.placeholder ?? 'Select...';
})

function isSelected(option: DropdownOption<T>): boolean {
    return isMatch(option.value, props.modelValue);
}

function selectOption(option: DropdownOption<T>) {
    if (option.disabled) return;
    emit('update:modelValue', option.value)
    isOpen.value = false;
}


function handleOutsideClick(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
}

onMounted(() => {
    window.addEventListener("click", handleOutsideClick);
})

onBeforeUnmount(() => {
    window.removeEventListener("click", handleOutsideClick);
})
</script>

<style scoped>
.dropdown {
    width: 200px;

    border: 1px solid black;
    padding: 10px;
}

.dropdown-trigger {
    width: 100%;
    border: 1px solid black;
    border-radius: 10px;
    padding: 10px;
    margin-top: 5px;

}

.dropdown-menu {
    list-style-type: none;
    padding-left: 0;

}

.dropdown-menu li {
    cursor: pointer;
    list-style: none;
    width: 100%;
    padding: 2px 0px;
    margin: 5px 0px;
    border: 1px solid black;
    border-radius: 2px
}

.dropdown-menu li:hover {
    background-color: rgb(16, 15, 15);
    color: white
}

.dropdown-menu li.selected {
    background-color: black;
    color: white;
}

.dropdown-menu li.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    color: #888;
}
</style>