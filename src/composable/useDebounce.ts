import { onUnmounted, ref, watch } from "vue";
import type { Ref } from "vue";

export function useDebounce<T>(source: Ref<T>, delay: number = 300): Ref<T> {
  const debounceValue = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  watch(source, (newValue) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => {
        debounceValue.value = newValue;
      },
      delay,
      {
        immediate: false,
      },
    );
  });

  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return debounceValue;
}
