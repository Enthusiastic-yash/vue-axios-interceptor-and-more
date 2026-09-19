import { onUnmounted, type Directive, type DirectiveBinding } from "vue";

interface HTMLElementWithClickOutside extends HTMLElement {
  __clickOutSideHandler__?: (event: MouseEvent) => void;
}

type ClickOutsideHandler = (event: MouseEvent) => void;

export const vClickOutside: Directive<
  HTMLElementWithClickOutside,
  ClickOutsideHandler
> = {
  mounted(el, binding: DirectiveBinding<ClickOutsideHandler>) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };
    el.__clickOutSideHandler__ = handler;
    document.addEventListener("click", handler);
  },

  unmounted(el) {
    if (el.__clickOutSideHandler__) {
      document.removeEventListener("click", el.__clickOutSideHandler__);
      delete el.__clickOutSideHandler__;
    }
  },
};
