<template>
    <div ref="containerRef" class="autoComplete-container" @keydown="handleKeyDown">
        <div>
            <input type="text" v-model="query" :placeholder="props.placeholder" class="autocomplete-input" />
        </div>
        <div v-if="isLoading" class="loader">Loading...</div>
        <ul v-if="isOpen && options.length > 0" class="autocomplete-dropdown" ref="listboxRef">
            <li v-for="(option, index) in options" :key="index" @click="handleSelectOption(option)"
                :class="{ highlighted: index == hightLightIndex }" class="autocomplete-item">
                <slot name="option" :option="option">
                    {{ getOptionLabel(option) }}
                </slot>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts" generic="T">
import { useDebounce } from "@/composable/useDebounce";
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue"
const props = withDefaults(defineProps<{
    fetchOption: (query: string, signal: AbortSignal) => Promise<T[]>;
    placeholder?: string;
    debounceTime: number;
    getOptionLabel: (option: T) => string;
}>(), {
    placeholder: 'Search...',
    debounceTime: 300
}
)

const query = ref("");
const isLoading = ref(false);
const options = ref([]) as Ref<T[]>
const isOpen = ref(false);
const hightLightIndex = ref(-1);
const containerRef = ref<HTMLDivElement | null>(null)
const listboxRef = ref<HTMLUListElement | null>(null)


const debounceQuery = useDebounce(query, props.debounceTime);

const emit = defineEmits<{
    (e: 'select', option: T): void
}>()

let abortController: AbortController | null = null;

watch(debounceQuery, async (newQuery) => {
    // If user cleared the input field, reset everything
    if (!newQuery.trim()) {
        options.value = [];
        isOpen.value = false;
        return;
    }
    // If a request is ALREADY running, CANCEL it before starting a new one
    abortController = new AbortController();
    if (abortController) {
        abortController.abort();
    }

    // Create a fresh controller for this new request
    abortController = new AbortController();
    isLoading.value = true;
    try {
        const result = await props.fetchOption(newQuery, abortController.signal)
        options.value = result;
        isOpen.value = true;
        hightLightIndex.value = -1;
    } catch (err: any) {
        // Axios throws 'CanceledError' or 'AbortError' when aborted.
        if (err.name !== 'CanceledError' || err.name !== 'AbortError') {
            console.log('Auto complete search failed')
        }

    } finally {
        isLoading.value = false;
    }
})


function scrollToActive() {

    if (!listboxRef.value || hightLightIndex.value < 0) return;
    const activeElement = listboxRef.value.children[hightLightIndex.value] as HTMLElement;

    if (activeElement && activeElement.scrollIntoView) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

}

function handleSelectOption(option: T) {
    emit('select', option)
    query.value = props.getOptionLabel(option)
    isOpen.value = false;
}

function handleKeyDown(event: KeyboardEvent) {
    if (!isOpen.value) return;
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            if (hightLightIndex.value < options.value.length - 1) {
                hightLightIndex.value++;
                scrollToActive()
            } else {
                hightLightIndex.value = 0;
            }
            break;

        case 'ArrowUp':
            event.preventDefault()
            if (hightLightIndex.value > 0) {
                hightLightIndex.value--;
                scrollToActive();
            } else {
                hightLightIndex.value = options.value.length - 1;
            }
            break;

        case 'Enter':
        case ' ':
            event.preventDefault()
            if (hightLightIndex.value > 0 && options.value[hightLightIndex.value]) {
                handleSelectOption(options.value[hightLightIndex.value] as T)
            }
            break;

        case 'Escape':
            if (isOpen.value) {
                event.preventDefault();
                isOpen.value = false;
            }
            break;
    }
}


function handleClickOutside(event: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        isOpen.value = false;
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
.autoComplete-container {
    position: relative;
    width: 320px;
    font-family: Arial, sans-serif;

}

.autocomplete-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
}

.loader {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 12px;
    color: #888;
}

.autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #ccc;
    border-top: none;
    background: #ffffff;
    list-style: none;
    margin: 4px 0 0 0;
    padding: 0;
    max-height: 220px;
    overflow-y: auto;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.autocomplete-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
}

.autocomplete-item.highlighted {
    background-color: #e8f0fe;
}
</style>