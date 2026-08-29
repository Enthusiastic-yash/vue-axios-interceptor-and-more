// useInfiniteScroll.js
import { ref } from "vue";

interface responseType {
  id: number;
  imageUrl: string;
  title: string;
}

export function useInfiniteScroll(fetchFunction: Function) {
  const items = ref<responseType[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const hasMore = ref(true);

  async function loadMore() {
    // guard: don't fetch if already loading, or if we know there's nothing left
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    try {
      const newItems = await fetchFunction(page.value);

      if (newItems.length === 0) {
        hasMore.value = false; // no more data — stop trying to fetch further
      } else {
        items.value.push(...newItems);
        page.value++;
      }
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, hasMore, loadMore };
}
