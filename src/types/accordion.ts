import type { InjectionKey } from "vue";

export interface AccordionContext {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
}

export const ACCORDION_KEY: InjectionKey<AccordionContext> =
  Symbol("accordion");
