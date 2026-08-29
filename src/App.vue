<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, nextTick, type Component } from "vue"
import Child from "./components/child.vue";
import ImageGallery from "./components/imageGallery.vue";
import InfiniteScrollImage from "./components/infiniteScrollImage.vue";

const currentTab = ref('ImageGallery')
const tabs = ref<Record<string, Component>>({
  ImageGallery: ImageGallery,
  InfiniteScrollImage: InfiniteScrollImage,
})
const modelRef = ref<InstanceType<typeof Child>>()
const data = ref<string | undefined>('Modal')

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

  <button @click="currentTab = 'ImageGallery'">ImageGallery</button>
  <button @click="currentTab = 'InfiniteScrollImage'">InfiniteScrollImage</button>

  <RouterView />
  <Component :is="tabs[currentTab]"></Component>
</template>
<style>
.container {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: blue;
}

.active {
  background-color: blue;
}
</style>