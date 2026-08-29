import type { Directive } from "vue";

interface HTMLImageElementWithObserver extends HTMLImageElement {
  _observer?: IntersectionObserver;
}

export const vInfiniteScroll: Directive<
  HTMLImageElementWithObserver,
  () => Promise<unknown>
> = {
  mounted(el, binding) {
    const callBack = binding.value;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callBack();
        }
      });
    });
    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    el._observer?.disconnect();
  },
};
