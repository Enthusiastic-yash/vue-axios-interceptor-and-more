<template>
    <div class="dropdown" ref="dropdownRef" @keydown="onKeydown">
        <!-- Dropdown Trigger Button -->
        <button ref="triggerBtnRef" type="button" class="dropdown-trigger" :class="{ 'is-open': isOpen }"
            aria-haspopup="listbox" :aria-expanded="isOpen" :aria-controls="listboxId"
            :aria-activedescendant="isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined"
            @click="toggleDropdown">
            <span class="dropdown-trigger-text">{{ displayButtonText }}</span>
            <span class="dropdown-arrow" aria-hidden="true">{{ isOpen ? '▲' : '▼' }}</span>
        </button>

        <!-- Dropdown Menu / Listbox -->
        <ul v-if="isOpen" :id="listboxId" ref="listboxRef" class="dropdown-menu" role="listbox" tabindex="-1"
            :aria-multiselectable="multiple">
            <li v-for="(option, index) in options" :id="getOptionId(index)" :key="option.id" role="option"
                class="dropdown-item" :class="{
                    'is-selected': isSelected(option),
                    'is-disabled': option.disabled,
                    'is-active': activeIndex === index
                }" :aria-selected="isSelected(option)" :aria-disabled="option.disabled ? 'true' : undefined"
                @click="selectOption(option)" @mouseenter="onOptionHover(index)">
                <!-- Checkbox visual indicator for multi-select -->
                <span v-if="multiple" class="checkbox-indicator" aria-hidden="true">
                    {{ isSelected(option) ? '✓' : '' }}
                </span>
                <span class="option-label">{{ option.label }}</span>


                <!-- Checkmark visual indicator for single-select -->
                <span v-if="!multiple && isSelected(option)" class="check-icon" aria-hidden="true">✓</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" generic="T">
import type { DropdownOption } from '../types/dropdown';
import { ref, computed, onMounted, onBeforeUnmount, nextTick, useId } from "vue";

// 1. Props Definition
const props = withDefaults(
    defineProps<{
        options: DropdownOption<T>[];
        modelValue: T | T[] | null;
        placeholder?: string;
        multiple?: boolean;
    }>(),
    {
        placeholder: 'Select...',
        multiple: false
    }
);

// 2. Emits Definition
const emit = defineEmits<{
    'update:modelValue': [value: T | T[] | null];
}>();

// 3. Template Refs & State
const isOpen = ref(false);
const activeIndex = ref(-1); // Tracks currently keyboard-highlighted option
const dropdownRef = ref<HTMLElement | null>(null);
const triggerBtnRef = ref<HTMLButtonElement | null>(null);
const listboxRef = ref<HTMLUListElement | null>(null);

// 4. Unique IDs for ARIA accessibility
const uniqueId = useId();
const listboxId = `${uniqueId}-listbox`;
function getOptionId(index: number) {
    return `${uniqueId}-option-${index}`;
}

// 5. Universal Equality Checker (Handles primitives, IDs, and complex objects)
function isMatch(val1: any, val2: any): boolean {
    if (val1 === val2) return true;
    if (val1 == null || val2 == null) return false;

    // Compare objects
    if (typeof val1 === 'object' && typeof val2 === 'object') {
        // If both objects contain an 'id' property, compare by ID
        if ('id' in val1 && 'id' in val2) {
            return val1.id === val2.id;
        }
        // Fallback to structural JSON comparison
        try {
            return JSON.stringify(val1) === JSON.stringify(val2);
        } catch {
            return false;
        }
    }
    return false;
}

// 6. Check if an option is selected (Supports single value or array)
function isSelected(option: DropdownOption<T>): boolean {
    if (props.modelValue == null) return false;

    if (props.multiple && Array.isArray(props.modelValue)) {
        return props.modelValue.some(val => isMatch(option.value, val));
    }
    return isMatch(option.value, props.modelValue);
}

// 7. Computed display text shown inside the trigger button
const displayButtonText = computed(() => {
    // Multi-select mode
    if (props.multiple && Array.isArray(props.modelValue)) {
        if (props.modelValue.length === 0) {
            return props.placeholder;
        }
        // Find matching option labels
        const matchedLabels = props.options
            .filter(opt => (props.modelValue as T[]).some(v => isMatch(opt.value, v)))
            .map(opt => opt.label);

        if (matchedLabels.length > 0) {
            return matchedLabels.join(', ');
        }
        return `${props.modelValue.length} selected`;
    }

    // Single-select mode
    const found = props.options.find(opt => isMatch(opt.value, props.modelValue));
    if (found) {
        return found.label ?? String(found.value);
    }
    return props.placeholder;
});

// 8. Toggle open / close state
function toggleDropdown() {
    if (isOpen.value) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

function openDropdown() {
    isOpen.value = true;
    // Set initial keyboard highlight: focus currently selected option or first available
    const firstSelectedIndex = props.options.findIndex(opt => isSelected(opt));
    if (firstSelectedIndex !== -1) {
        activeIndex.value = firstSelectedIndex;
    } else {
        activeIndex.value = props.options.findIndex(opt => !opt.disabled);
    }
    scrollToActive();
}

function closeDropdown() {
    isOpen.value = false;
    activeIndex.value = -1;
}

// 9. Select Option Logic (Handles both single and multi-select)
function selectOption(option: DropdownOption<T>) {
    if (option.disabled) return;
    if (props.multiple) {
        const currentList = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
        const existingIndex = currentList.findIndex(val => isMatch(option.value, val));

        if (existingIndex > -1) {
            // Already selected: unselect (remove)
            currentList.splice(existingIndex, 1);
        } else {
            // Not selected: add to selection
            currentList.push(option.value);
        }
        emit('update:modelValue', currentList);
    } else {
        // Single selection: emit value, close dropdown, and return focus to button
        emit('update:modelValue', option.value);
        closeDropdown();
        triggerBtnRef.value?.focus();
    }
}

// 10. Mouse hover sync with keyboard highlight
function onOptionHover(index: number) {
    if (!props.options[index]?.disabled) {
        activeIndex.value = index;
    }
}

// 11. Scroll the active keyboard option into view inside scrollable menu
function scrollToActive() {
    nextTick(() => {
        if (!listboxRef.value || activeIndex.value < 0) return;
        const activeElement = listboxRef.value.children[activeIndex.value] as HTMLElement;
        if (activeElement && activeElement.scrollIntoView) {
            activeElement.scrollIntoView({ block: 'nearest' });
        }
    });
}

// Helper: Find next non-disabled option index
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

// 12. Full Keyboard Navigation Handler
function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (!isOpen.value) {
                openDropdown();
            } else {
                moveActive(1);
            }
            break;

        case 'ArrowUp':
            event.preventDefault();
            if (!isOpen.value) {
                openDropdown();
            } else {
                moveActive(-1);
            }
            break;

        case 'Home':
            if (isOpen.value) {
                event.preventDefault();
                const firstAvailable = props.options.findIndex(opt => !opt.disabled);
                if (firstAvailable !== -1) {
                    activeIndex.value = firstAvailable;
                    scrollToActive();
                }
            }
            break;

        case 'End':
            if (isOpen.value) {
                event.preventDefault();
                for (let i = props.options.length - 1; i >= 0; i--) {
                    if (!props.options[i]?.disabled) {
                        activeIndex.value = i;
                        scrollToActive();
                        break;
                    }
                }
            }
            break;

        case 'Enter':
        case ' ': // Space key
            event.preventDefault();
            if (!isOpen.value) {
                openDropdown();
            } else if (activeIndex.value >= 0) {
                const opt = props.options[activeIndex.value];
                if (opt) {
                    selectOption(opt);
                }
            }
            break;

        case 'Escape':
            if (isOpen.value) {
                event.preventDefault();
                closeDropdown();
                triggerBtnRef.value?.focus();
            }
            break;

        case 'Tab':
            // If user tabs away, cleanly close the dropdown
            if (isOpen.value) {
                closeDropdown();
            }
            break;
    }
}

// 13. Click outside listener
function handleOutsideClick(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        closeDropdown();
    }
}

onMounted(() => {
    window.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
    window.removeEventListener("click", handleOutsideClick);
});
</script>

<style scoped>
.dropdown {
    position: relative;
    width: 260px;
    font-family: inherit;
    box-sizing: border-box;
}

.dropdown-trigger {
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: #ffffff;
    border: 1px solid #000000;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    transition: all 0.2s ease;
    gap: 8px;
}

.dropdown-trigger:focus-visible {
    outline: 2px solid #000000;
    outline-offset: 2px;
}

.dropdown-trigger.is-open {
    border-color: #000000;
}

.dropdown-trigger-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dropdown-arrow {
    font-size: 10px;
    color: #555555;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    padding: 4px;
    list-style: none;
    background-color: #ffffff;
    border: 1px solid #000000;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
    box-sizing: border-box;
}

.dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    margin-bottom: 2px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, color 0.15s ease;
    gap: 8px;
}

.option-label {
    flex: 1;
}

/* Hover & Keyboard Active Highlight */
.dropdown-item.is-active {
    background-color: #f0f0f0;
}

/* Selected State */
.dropdown-item.is-selected {
    background-color: #000000;
    color: #ffffff;
}

.dropdown-item.is-selected.is-active {
    background-color: #222222;
}

/* Disabled State */
.dropdown-item.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: transparent !important;
    color: #888888 !important;
}

/* Multi-select Checkbox Box */
.checkbox-indicator {
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

/* Single-select Checkmark */
.check-icon {
    font-size: 14px;
    font-weight: bold;
}
</style>