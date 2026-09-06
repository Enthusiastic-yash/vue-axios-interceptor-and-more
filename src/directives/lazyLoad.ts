import type { Directive, DirectiveBinding } from "vue";

// // Define a type that extends HTMLImageElement to include the observer
interface HTMLImageElementWithObserver extends HTMLImageElement {
  _observer?: IntersectionObserver;
}

const lazyLoad: Directive<HTMLImageElementWithObserver, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // console.log(entry.target);
          el.src = binding.value;
          observer.unobserve(el);
        }
      });
    });
    observer.observe(el);
    el._observer = observer;
  },

  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
    }
  },
};

export default lazyLoad;
