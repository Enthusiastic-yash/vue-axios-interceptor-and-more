<!-- InfiniteImageGallery.vue -->
<template>
    <div>
        <h1>Image Gallery with Infinite scroll</h1>
        <ul class="gallery">
            <li v-for="item in items" :key="item.id">
                <img :src="item.imageUrl" :alt="item.title" />
            </li>
        </ul>

        <!-- the sentinel — invisible, just a trigger -->
        <div v-infinite-scroll="loadMore" class="sentinel"></div>

        <p v-if="loading">Loading more...</p>
        <p v-if="!hasMore">You've reached the end!</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInfiniteScroll } from '../composable/useInfiniteScroll.js'
import { vInfiniteScroll } from '../directives/VInfiniteScroll.js'
import axios from 'axios'

interface responseType {
    id: number,
    title: string,
    alt: string,
    src: {
        medium: string
    }
}

// this function knows HOW to fetch a page — passed into the composable
async function fetchImages(page: number) {
    const response = await axios.get('https://api.pexels.com/v1/search', {
        params: { query: 'nature', page, per_page: 15 },
        headers: { Authorization: import.meta.env.VITE_API_PEXELS_API_KEY }
    })
    return response.data.photos.map((photo: responseType) => ({
        id: photo.id,
        imageUrl: photo.src?.medium,
        title: photo?.alt
    }))
}

const { items, loading, hasMore, loadMore } = useInfiniteScroll(fetchImages)

// load the FIRST page immediately when the component mounts
onMounted(() => {
    loadMore()
})
</script>

<style scoped>
.gallery {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    list-style: none;
}

.sentinel {
    height: 1px;
    /* invisible but still a real element the observer can watch */
}
</style>