import { type Directive, type DirectiveBinding } from "vue";

interface HTMLElementWithClickOutside extends HTMLElement {
  __clickOutSideHandler__?: (event: MouseEvent) => void;
  // __clickOutsideTimer__?: ReturnType<typeof setTimeout>;
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
    // Defer listener registration so the click that mounted the element doesn't immediately fire this handler
    // el.__clickOutsideTimer__ = setTimeout(() => {
    //   document.addEventListener("click", handler);
    // }, 0);
  },

  unmounted(el) {
    // if (el.__clickOutsideTimer__) {
    //   clearTimeout(el.__clickOutsideTimer__);
    //   delete el.__clickOutsideTimer__;
    // }
    if (el.__clickOutSideHandler__) {
      document.removeEventListener("click", el.__clickOutSideHandler__);
      delete el.__clickOutSideHandler__;
    }
  },
};
