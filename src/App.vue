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

function openModel() {
  modelRef.value?.open()
}

</script>

<template>
  <!-- <button @click="openModel">open</button> -->
  <!-- <Child ref="modelRef" :data="data" placeholder="Enter your name">
    <select>
      <option value="1">one</option>
      <option value="2">two</option>
      <option value="3">three</option>
    </select>
  </Child> -->


  <dropDown v-model="selectedFruit" :options="fruitOptions" placeholder="Please select one value"></dropDown>

  <h2>seleced value : {{ selectedFruit }}</h2>
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