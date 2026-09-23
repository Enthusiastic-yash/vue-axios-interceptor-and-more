<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="modelValue" class="modal-overlay" @click.self="close" role="dialog" aria-modal="true"
                :aria-labelledby="title ? 'modal-title' : undefined">
                <div class="modal-content" v-click-outside="close">
                    <header class="modal-header">
                        <slot name="header">
                            <h3 id="modal-title" class="modal-title">{{ title }}</h3>
                        </slot>
                        <button class="modal-close" @click="close" aria-label="Close modal" type="button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </header>
                    <div class="modal-body">
                        <slot />
                    </div>
                    <footer v-if="$slots.footer" class="modal-footer">
                        <slot name="footer" />
                    </footer>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import { vClickOutside } from '@/directives/clickOutside';

const props = withDefaults(defineProps<{
    modelValue: boolean;
    title?: string;
    closeOnEsc?: boolean;
}>(), {
    closeOnEsc: true
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    // (e: 'close'): void;
}>();

function close() {
    emit('update:modelValue', false);
    // emit('close');
}

function handleKeydown(e: KeyboardEvent) {
    if (props.closeOnEsc && e.key === 'Escape') {
        close();
    }
}

watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        window.addEventListener('keydown', handleKeydown);
        // document.body.style.overflow = 'hidden';
    } else {
        window.removeEventListener('keydown', handleKeydown);
        // document.body.style.overflow = '';
    }
}, { immediate: true });

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
    box-sizing: border-box;
}

.modal-content {
    position: relative;
    width: 100%;
    max-width: 520px;
    max-height: calc(100vh - 64px);
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #ffffff;
}

.modal-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: #0f172a;
}

.modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: #64748b;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background-color: #f1f5f9;
    color: #0f172a;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    color: #334155;
    font-size: 0.95rem;
    line-height: 1.6;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 14px 20px;
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
}
</style>