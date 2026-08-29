<template>


    <dialog ref="dialogEl" @click="handleBackdropClick">
        <div class="modelContent">
            <h2>{{ data }}</h2>
            <slot></slot>
            <button @click="close">close</button>
        </div>
    </dialog>
    <input type="text" v-bind="$attrs">

</template>

<script setup lang="ts">
import { ref } from "vue"
const dialogEl = ref<HTMLDialogElement | null>(null)
interface propsType {
    data?: string
}
const { data = "childmodel" } = defineProps<propsType>()
function open() {
    dialogEl.value?.showModal()
}
function close() {
    dialogEl.value?.close()
}

function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl.value) {
        close()
    }
}

defineExpose({ open, close })

</script>

<style scoped>
.text-red {
    color: red
}

.modelContent {
    width: 200px;
    height: 200px;
    padding: 20px;
}

dialog {
    padding: 0
}

dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);

}
</style>