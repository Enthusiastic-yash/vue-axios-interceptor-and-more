<template>
    <div class="dropdown" ref="dropdownRef" @keydown="onKeyDown">
        <button class="dropdown-trigger" ref="triggerBtnRef" @click="isopen = !isopen">
            <span class="dropdown-trigger-text">{{ displayButton }}</span>
            <span>{{ isopen ? '😁' : '😶' }}</span>
        </button>


        <ul v-if="isopen" class="dropdown-menu" ref="listboxRef">
            <li v-for="(option, index) in options" class="dropdown-item"
                :class="{ 'is-disabled': option.disabled, 'is-selected': isSelected(option), 'is-active': activeIndex === index }"
                @click="selectOption(option)" @mouseenter="onOptionHover(index)"
                :aria-disabled="option.disabled ? true : undefined">
                <span class="option-label">{{ option.label }}</span>
                <span v-if="multiple" class="checkbox-indicator">{{ isSelected(option) ? "✓" : "" }}</span>

                <span v-if="!multiple && isSelected(option)" class="check-icon" aria-hidden="true">✓</span>

            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from "vue"
import type { DropdownOption, } from "../types/dropdown"

const props = withDefaults(defineProps<{
    options: DropdownOption<T>[];
    modelValue: T | T[] | null;
    placeholder: string;
    multiple?: boolean;
}>(),
    {
        placeholder: 'select...',
        multiple: false
    }
)

const triggerBtnRef = ref<HTMLButtonElement | null>(null)
const activeIndex = ref(-1)
const isopen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null)
const listboxRef = ref<HTMLUListElement | null>(null)

const emit = defineEmits<{
    'update:modelValue': [value: T | T[] | null]
}>()

function isMatch(val1: unknown, val2: unknown) {
    if (val1 === val2) return true;
    if (val1 === null || val2 === null) return false;
    if (typeof val1 === 'object' && typeof val2 === 'object') {
        if ('id' in val1 && 'id' in val2) {
            return val1.id === val2.id
        }
        try {
            return JSON.stringify(val1) === JSON.stringify(val2)
        } catch {
            return false
        }
    }
    return false;
}


function onOptionHover(index: number) {
    if (!props.options[index]?.disabled) {
        activeIndex.value = index;
    }
}

function isSelected(selectedOption: DropdownOption<T>) {
    if (props.multiple && Array.isArray(props.modelValue)) {
        return props.modelValue.some(val => isMatch(val, selectedOption.value))
    }

    return isMatch(props.modelValue, selectedOption.value)
}


function selectOption(option: DropdownOption<T>) {
    if (option.disabled) return false
    if (props.multiple) {
        const currentList = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
        const existingIndex = currentList.findIndex(val => isMatch(val, option.value))
        if (existingIndex > -1) {
            currentList.splice(existingIndex, 1)
        } else {
            currentList.push(option.value)
        }
        emit('update:modelValue', currentList)
    } else {
        emit('update:modelValue', option.value)
        closeDropDown();

    }
}

const displayButton = computed(() => {
    function getLabel(value: T) {
        return props.options.find(opt => isMatch(opt.value, value))?.label
    }
    if (props.multiple && Array.isArray(props.modelValue)) {
        if (props.modelValue.length === 0) return props.placeholder
        const selectedItem = props.modelValue.map(value => getLabel(value))
        return selectedItem.join(',')

    }
    return getLabel(props.modelValue as T) ?? props.placeholder

})

function closeDropDown() {
    isopen.value = false
    activeIndex.value = -1;
}

function openDropdown() {
    isopen.value = true;
    let existingIndex = props.options.findIndex(val => isSelected(val))
    if (existingIndex !== -1) {
        activeIndex.value = existingIndex
    } else {
        activeIndex.value = props.options.findIndex(opt => !opt.disabled)
    }
    scrollToActive()
}

function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value?.contains(event?.target as Node)) {
        closeDropDown()
    }
}

function scrollToActive() {
    nextTick(() => {
        if (!listboxRef.value || activeIndex.value < 0) return;
        const activeElement = listboxRef.value.children[activeIndex.value] as HTMLElement;
        if (activeElement && activeElement.scrollIntoView) {
            activeElement.scrollIntoView({ block: 'nearest' });
        }
    });
}

function moveActive(direction: 1 | -1) {
    const total = props.options.length;
    if (total === 0) return;

    let next = activeIndex.value;
    for (let i = 0; i < total; i++) {
        next = (next + direction + total) % total;
        if (!props.options[next]?.disabled) {
            activeIndex.value = next;
            scrollToActive();
            break;
        }
    }
}


function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (!isopen.value) {
                openDropdown()
            } else {
                moveActive(1)
            }
            break;
        case 'ArrowUp':
            event.preventDefault()
            if (!isopen.value) {
                openDropdown()
            } else {
                moveActive(-1)
            }
            break;

        case 'Enter':
        case ' ':
            event.preventDefault();
            if (!isopen.value) {
                openDropdown()
            } else if (activeIndex.value >= 0) {
                const opt = props.options[activeIndex.value]
                if (opt) {
                    selectOption(opt)
                }
            }
            break;
        case 'Escape':
            if (isopen.value) {
                closeDropDown()
                triggerBtnRef.value?.focus()
            }
            break;
        case 'Tab':
            if (isopen.value) {
                closeDropDown();
            }
            break;
    }
}

onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})


onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>
.dropdown {
    position: relative;
    width: 256px;
    box-sizing: border-box;
    font-family: inherit;
}


.dropdown-trigger {
    width: 100%;
    min-height: 40px;
    border: 1px solid black;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 200;
    cursor: pointer;
    background-color: #fff;

}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    z-index: 1;
    width: 100%;
    max-height: 220px;
    border-radius: 8px;
    background-color: white;
    padding: 10px;
    border: 1px solid black;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
    list-style: none;
    box-sizing: border-box;
    overflow-y: auto;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;

}

.dropdown-item {
    padding: 5px 5px;
    margin: 2px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.dropdown-item:hover {
    background-color: rgb(231, 232, 234);
}

.dropdown-item.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: transparent !important;
    color: #888888 !important;
}

.dropdown-trigger-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown-item.is-selected {
    background-color: black;
    color: #fff
}

.dropdown-menu .checkbox-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 1px solid currentColor;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
}

.check-icon {
    font-size: 14px;
    font-weight: bold;
}

.dropdown-item.is-active {
    background-color: #f0f0f0;
}

.dropdown-item.is-selected.is-active {
    background-color: #222222;
}
</style>