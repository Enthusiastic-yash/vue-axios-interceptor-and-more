<template>
    <div class="dropdown" ref="dropdownRef" @keydown="onKeydown">
        <!-- Dropdown Trigger Button -->
        <button ref="triggerBtnRef" type="button" class="dropdown-trigger" :class="{
            'is-open': isOpen,
            'has-error': hasError,
            'is-disabled': disabled
        }" :disabled="disabled" aria-haspopup="listbox" :aria-expanded="isOpen" :aria-controls="listboxId"
            :aria-invalid="hasError ? 'true' : undefined" :aria-describedby="hasError ? errorId : undefined"
            :aria-activedescendant="isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined"
            @click="toggleDropdown" @blur="onTriggerBlur">
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

        <!-- Validation Error Message / Customizable Slot -->
        <slot name="error" :message="errorMessage" :meta="meta">
            <p v-if="showError && hasError" :id="errorId" class="dropdown-error-message" role="alert">
                {{ errorMessage }}
            </p>
        </slot>
    </div>
</template>

<script setup lang="ts" generic="T">
import type { DropdownOption } from '../types/dropdown';
import { ref, computed, onMounted, onBeforeUnmount, nextTick, useId } from "vue";
import { useField } from 'vee-validate';

// 1. Props Definition (Supports both standalone v-model and VeeValidate forms)
const props = withDefaults(
    defineProps<{
        options: DropdownOption<T>[];
        modelValue?: T | T[] | null;
        name?: string;               // VeeValidate field name (for form schema/rules)
        rules?: any;                  // Standalone validation rules (string, yup, zod, function)
        label?: string;               // Friendly name for error messages
        placeholder?: string;
        multiple?: boolean;
        disabled?: boolean;
        showError?: boolean;          // Controls whether the error message is displayed below
    }>(),
    {
        placeholder: 'Select...',
        multiple: false,
        disabled: false,
        showError: true
    }
);

// 2. Emits Definition
const emit = defineEmits<{
    'update:modelValue': [value: T | T[] | null];
    'blur': [];
    'change': [value: T | T[] | null];
}>();

// 3. VeeValidate useField Integration
// When props.name is provided, it connects to parent VeeValidate <Form> context.
// When props.name is not provided, standalone: true allows it to work normally with v-model.
const fieldName = computed(() => props.name || '');

const {
    value: fieldValue,
    errorMessage,
    meta,
    handleBlur: veeHandleBlur,
    handleChange: veeHandleChange
} = useField<T | T[] | null>(fieldName, props.rules, {
    syncVModel: true,
    standalone: !props.name,
    label: props.label || props.name
});

// Current active value: reads from VeeValidate field or v-model prop
const currentValue = computed<T | T[] | null>(() => {
    if (props.name) {
        return fieldValue.value !== undefined ? fieldValue.value : (props.modelValue ?? null);
    }
    return props.modelValue ?? null;
});

// Error visibility: Show error if message exists and user interacted or form was submitted
const hasError = computed(() => {
    return Boolean(errorMessage.value && (meta.touched || meta.validated || meta.dirty));
});

// 4. Template Refs & State
const isOpen = ref(false);
const activeIndex = ref(-1); // Tracks currently keyboard-highlighted option
const dropdownRef = ref<HTMLElement | null>(null);
const triggerBtnRef = ref<HTMLButtonElement | null>(null);
const listboxRef = ref<HTMLUListElement | null>(null);

// 5. Unique IDs for ARIA accessibility
const uniqueId = useId();
const listboxId = `${uniqueId}-listbox`;
const errorId = `${uniqueId}-error`;
function getOptionId(index: number) {
    return `${uniqueId}-option-${index}`;
}

// 6. Universal Equality Checker (Handles primitives, IDs, and complex objects)
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

// 7. Check if an option is selected (Supports single value or array)
function isSelected(option: DropdownOption<T>): boolean {
    const val = currentValue.value;
    if (val == null) return false;

    if (props.multiple && Array.isArray(val)) {
        return val.some(item => isMatch(option.value, item));
    }
    return isMatch(option.value, val);
}

// 8. Computed display text shown inside the trigger button
const displayButtonText = computed(() => {
    function getLabel(value: T) {
        return props.options.find(opt => isMatch(opt.value, value))?.label;
    }

    const val = currentValue.value;

    // Multi-select mode
    if (props.multiple && Array.isArray(val)) {
        if (val.length === 0) return props.placeholder;
        const labels = val.map(getLabel).filter(Boolean);
        return labels.length > 0 ? labels.join(', ') : `${val.length} selected`;
    }

    // Single-select mode
    if (val != null) {
        const label = getLabel(val as T);
        if (label != null) return label;
    }

    return props.placeholder;
});

// 9. Toggle open / close state
function toggleDropdown() {
    if (props.disabled) return;
    if (isOpen.value) {
        closeDropdown();
    } else {
        openDropdown();
    }
}

function openDropdown() {
    if (props.disabled) return;
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
    if (!isOpen.value) return;
    isOpen.value = false;
    activeIndex.value = -1;

    // Notify VeeValidate that the field was blurred/interacted with
    veeHandleBlur();
    emit('blur');
}

function onTriggerBlur() {
    // When focus leaves the button while dropdown is closed, mark as blurred
    if (!isOpen.value) {
        veeHandleBlur();
        emit('blur');
    }
}

// 10. Select Option Logic (Handles single & multi-select, updates VeeValidate & emits)
function selectOption(option: DropdownOption<T>) {
    if (option.disabled || props.disabled) return;

    if (props.multiple) {
        const cur = currentValue.value;
        const currentList = Array.isArray(cur) ? [...cur] : [];
        const existingIndex = currentList.findIndex(val => isMatch(option.value, val));

        if (existingIndex > -1) {
            // Already selected: unselect (remove)
            currentList.splice(existingIndex, 1);
        } else {
            // Not selected: add to selection
            currentList.push(option.value);
        }

        // Update VeeValidate form state & emit events
        veeHandleChange(currentList);
        emit('update:modelValue', currentList);
        emit('change', currentList);
    } else {
        // Single selection
        veeHandleChange(option.value);
        emit('update:modelValue', option.value);
        emit('change', option.value);
        closeDropdown();
        triggerBtnRef.value?.focus();
    }
}

// 11. Mouse hover sync with keyboard highlight
function onOptionHover(index: number) {
    if (!props.options[index]?.disabled) {
        activeIndex.value = index;
    }
}

// 12. Scroll the active keyboard option into view inside scrollable menu
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

// 13. Full Keyboard Navigation Handler
function onKeydown(event: KeyboardEvent) {
    if (props.disabled) return;

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
            // If user tabs away, cleanly close the dropdown and blur
            if (isOpen.value) {
                closeDropdown();
            }
            break;
    }
}

// 14. Click outside listener
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

// Expose useful VeeValidate field context for template ref access if needed
defineExpose({
    value: fieldValue,
    errorMessage,
    meta,
    hasError,
    open: openDropdown,
    close: closeDropdown
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
    box-sizing: border-box;
}

.dropdown-trigger:focus-visible {
    outline: 2px solid #000000;
    outline-offset: 2px;
}

.dropdown-trigger.is-open {
    border-color: #000000;
}

/* Error State */
.dropdown-trigger.has-error {
    border-color: #dc2626;
    background-color: #fff8f8;
}

.dropdown-trigger.has-error:focus-visible {
    outline-color: #dc2626;
}

/* Disabled State */
.dropdown-trigger.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
    border-color: #d1d5db;
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

/* Error Message Below Dropdown */
.dropdown-error-message {
    margin: 4px 0 0 2px;
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
    line-height: 1.4;
}
</style>