import { SelectOption } from './SearchField';

export type FieldConfigItem<TFilter extends Record<string, any>> =
  | {
      type: 'select';
      mode?: 'single' | 'multiple';
      name: keyof TFilter;
      label?: string;
      options: SelectOption[];
    }
  | {
      type: 'text';
      name: keyof TFilter;
      label?: string;
      placeholder?: string;
    };