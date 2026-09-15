<script setup lang="ts">
import { ref, type Component } from "vue"
import Child from "./components/child.vue";
import ImageGallery from "./components/imageGallery.vue";
import InfiniteScrollImage from "./components/infiniteScrollImage.vue";
import DropDownExample from "./components/dropDownExample.vue";
import multiStepForm from "./components/multiStepForm.vue";


const currentTab = ref('ImageGallery')
const tabs = ref<Record<string, Component>>({
  ImageGallery: ImageGallery,
  InfiniteScrollImage: InfiniteScrollImage,
  DropDownExample: DropDownExample,
  multiStepForm: multiStepForm

})
const modelRef = ref<InstanceType<typeof Child>>()
const data = ref<string | undefined>('Modal')




function openModel() {
  modelRef.value?.open()
}

</script>

<template>

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