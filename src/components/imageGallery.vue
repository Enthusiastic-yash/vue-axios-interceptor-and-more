<template>
    <div>
        <h1>Image Gallery</h1>
        <ul>
            <li v-for="image in images" :key="image.id">
                <img v-lazy-load="image.src.large" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const images = ref<any[]>([]);

async function fetchImages() {
    let image = await axios.get('https://api.pexels.com/v1/search?query=nature', {
        headers: {
            Authorization: import.meta.env.VITE_API_PEXELS_API_KEY,
        }
    })
    images.value = image.data.photos
    // console.log(image.data.photos);
}


onMounted(() => {
    fetchImages()
})

</script>

<style scoped></style>