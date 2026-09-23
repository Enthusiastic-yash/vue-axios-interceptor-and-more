<template>
    <div class="example-container">
        <div class="example-card">
            <h2 class="example-title">Modal Component Demo</h2>
            <p class="example-description">
                A flexible, accessible, and animated modal dialog with backdrop blur,
                click-outside detection, keyboard navigation (<kbd>Esc</kbd>), and slot customization.
            </p>

            <div class="button-group">
                <button class="btn btn-primary" @click="openBasicModal">
                    Open Basic Modal
                </button>
                <button class="btn btn-secondary" @click="openCustomModal">
                    Open Modal with Custom Header
                </button>
            </div>

            <div v-if="lastAction" class="status-banner">
                <span>{{ lastAction }}</span>
            </div>

            <div class="features-list">
                <h3>Features Supported:</h3>
                <ul>
                    <li><strong>v-model</strong> two-way binding for visibility</li>
                    <li><strong>Click outside</strong> or backdrop click to dismiss</li>
                    <li><strong>Escape key</strong> shortcut to close</li>
                    <li><strong>Body scroll locking</strong> when modal is active</li>
                    <li><strong>Teleport to body</strong> prevents clipping by parent containers</li>
                    <li><strong>Custom slots:</strong> <code>#header</code>, default body, and <code>#footer</code></li>
                </ul>
            </div>
        </div>
        <!-- Basic Modal -->
        <Modal v-model="showBasicModal" title="Confirm Action">
            <div class="modal-body-content">
                <p>Are you sure you want to proceed with this operation? This action can be easily customized through
                    the default slot.</p>
                <div class="info-box">
                    <p>💡 <strong>Tip:</strong> You can click on the backdrop, click the ✕ button, or press the
                        <kbd>Esc</kbd> key to close this modal.
                    </p>
                </div>
            </div>
            <template #footer>
                <button class="btn btn-outline" @click="handleCancel">Cancel</button>
                <button class="btn btn-primary" @click="handleConfirm">Confirm</button>
            </template>
        </Modal>

        <!-- Custom Header & Form Modal -->
        <Modal v-model="showCustomModal">
            <template #header>
                <div class="custom-header">
                    <span class="header-icon">🚀</span>
                    <div>
                        <h3 class="custom-title">Special Announcement</h3>
                        <span class="custom-subtitle">Custom header slot in action</span>
                    </div>
                </div>
            </template>
            <div class="modal-body-content">
                <p>This modal demonstrates overriding the default header title with custom HTML elements and icons via
                    the
                    <code>#header</code> slot.
                </p>
                <label class="form-label">
                    Quick note:
                    <input v-model="userNote" type="text" placeholder="Type something here..." class="form-input" />
                </label>
            </div>
            <template #footer>
                <button class="btn btn-outline" @click="showCustomModal = false">Close</button>
                <button class="btn btn-accent" @click="handleSaveNote">Save Note</button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './modal.vue';

const showBasicModal = ref(false);
const showCustomModal = ref(false);
const lastAction = ref<string>('');
const userNote = ref('');

function openBasicModal() {
    showBasicModal.value = true;
}

function openCustomModal() {
    showCustomModal.value = true;
}

function handleConfirm() {
    lastAction.value = `Confirmed at ${new Date().toLocaleTimeString()}`;
    showBasicModal.value = false;
}

function handleCancel() {
    lastAction.value = `Cancelled at ${new Date().toLocaleTimeString()}`;
    showBasicModal.value = false;
}

function handleSaveNote() {
    lastAction.value = `Saved note: "${userNote.value || 'No note entered'}" at ${new Date().toLocaleTimeString()}`;
    showCustomModal.value = false;
}
</script>

<style scoped>
.example-container {
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.example-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
}

.example-title {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
}

.example-description {
    color: #64748b;
    margin-bottom: 20px;
    line-height: 1.5;
}

.button-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.btn {
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background-color: #2563eb;
    color: #ffffff;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.btn-secondary {
    background-color: #0f172a;
    color: #ffffff;
}

.btn-secondary:hover {
    background-color: #334155;
}

.btn-outline {
    background-color: transparent;
    border: 1px solid #cbd5e1;
    color: #475569;
}

.btn-outline:hover {
    background-color: #f1f5f9;
    color: #0f172a;
}

.btn-accent {
    background-color: #10b981;
    color: #ffffff;
}

.btn-accent:hover {
    background-color: #059669;
}

.status-banner {
    padding: 12px 16px;
    background-color: #f0fdf4;
    border-left: 4px solid #22c55e;
    color: #15803d;
    border-radius: 6px;
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.features-list {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

.features-list h3 {
    margin: 0 0 12px 0;
    font-size: 1rem;
    color: #334155;
}

.features-list ul {
    margin: 0;
    padding-left: 20px;
    color: #64748b;
    line-height: 1.8;
}

.modal-body-content p {
    margin: 0 0 12px 0;
    line-height: 1.5;
}

.info-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 0.875rem;
    color: #475569;
}

.info-box p {
    margin: 0;
}

.custom-header {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-icon {
    font-size: 1.75rem;
}

.custom-title {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 600;
    color: #0f172a;
}

.custom-subtitle {
    font-size: 0.8rem;
    color: #64748b;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
    margin-top: 12px;
}

.form-input {
    width: 100%;
    margin-top: 6px;
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.9rem;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

kbd {
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.8rem;
    font-family: monospace;
}
</style>