export interface DropdownOption<T = unknown> {
  id: string | number;
  label: string;
  value: T;
  disabled: boolean;
}
