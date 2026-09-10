<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, nextTick, type Component } from "vue"
import Child from "./components/child.vue";
import ImageGallery from "./components/imageGallery.vue";
import InfiniteScrollImage from "./components/infiniteScrollImage.vue";
import multiStepForm from "./components/multiStepForm.vue";
import dropDown from "./components/dropDown.vue";
import type { DropdownOption } from './types/dropdown.ts'

const currentTab = ref('ImageGallery')
const tabs = ref<Record<string, Component>>({
  ImageGallery: ImageGallery,
  InfiniteScrollImage: InfiniteScrollImage,
  multiStepForm: multiStepForm
})
const modelRef = ref<InstanceType<typeof Child>>()
const data = ref<string | undefined>('Modal')

interface Fruit {
  id: number
  name: string
}
const fruitOptions: DropdownOption<Fruit>[] = [
  {
    id: 1,
    label: 'Apple',
    value: { id: 1, name: 'apple' },
    disabled: false
  },
  {
    id: 2,
    label: 'Banana',
    value: { id: 2, name: 'banana' },
    disabled: true
  },
  {
    id: 3,
    label: 'Cherry',
    value: { id: 3, name: 'cherry' },
    disabled: false
  }
]
const selectedFruit = ref<Fruit | null>(null)
const selectedMultipleFruits = ref<Fruit[]>([])
const selectedColors = ref<string[]>([])

const colorOptions: DropdownOption<string>[] = [
  { id: 1, label: 'Red', value: 'red', disabled: false },
  { id: 2, label: 'Green', value: 'green', disabled: false },
  { id: 3, label: 'Blue', value: 'blue', disabled: false },
  { id: 4, label: 'Yellow (Disabled)', value: 'yellow', disabled: true },
  { id: 5, label: 'Orange', value: 'orange', disabled: false },
  { id: 6, label: 'sky blue', value: 'sky blue', disabled: false },
  { id: 7, label: 'black', value: 'black', disabled: false },
]


function openModel() {
  modelRef.value?.open()
}

</script>

<template>
  <div style="display: flex; gap: 30px; flex-wrap: wrap; margin-bottom: 24px;">
    <!-- 1. Single Select with Object -->
    <div>
      <h3>1. Single Select (Objects)</h3>
      <dropDown v-model="selectedFruit" :options="fruitOptions" placeholder="Select a fruit" />
      <p><strong>Selected:</strong> {{ selectedFruit }}</p>
    </div>

    <!-- 2. Multi Select with Objects -->
    <div>
      <h3>2. Multi Select (Objects)</h3>
      <dropDown v-model="selectedMultipleFruits" :options="fruitOptions" placeholder="Select multiple fruits"
        :multiple="true" />
      <p><strong>Selected:</strong> {{ selectedMultipleFruits }}</p>
    </div>

    <!-- 3. Multi Select with Simple Primitives (Strings) -->
    <div>
      <h3>3. Multi Select (Simple Strings)</h3>
      <dropDown v-model="selectedColors" :options="colorOptions" placeholder="Select colors" :multiple="true" />
      <p><strong>Selected:</strong> {{ selectedColors }}</p>
    </div>
  </div>
  <button v-for="(button, key) in tabs" :class="{ active: currentTab == key }" :key="key" @click="currentTab = key">{{
    key }}
  </button>
  <Transition name="fade" mode="out-in">

    <Component :is="tabs[currentTab]"></Component>

  </Transition>


</template>
<style>
.container {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: blue;
}

.active {
  background-color: black;
  color: white
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>