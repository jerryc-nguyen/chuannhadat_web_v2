import { FieldConfigItem } from './types';
import { Path, UseFormReturn } from 'react-hook-form';

export const useFilterBase = <T extends Record<string, any>>(
  customFields: FieldConfigItem<T>[],
  form: UseFormReturn<T, any, undefined>,
  searchable?: boolean,
  onSearch?: () => void,
  onReset?: () => void,
) => {
  const { watch, setValue } = form;
  const formValues = watch();

  const onFilterChange = (name: keyof T, nextValue: any) => {
    setValue(name as Path<T>, nextValue, { shouldDirty: true });
  };

  const onChangeSearchBy = (val: string) => {
    setValue('search_by' as Path<T>, val as any, { shouldDirty: true });
  };

  const onChangeSearchValue = (val: string) => {
    setValue('search_value' as Path<T>, val as any, { shouldDirty: true });
  };

  const onClear = () => {
    // Reset form to its original defaultValues
    form.reset();
    // Trigger higher-level reset (e.g., useListController.actions.resetFilters) if provided
    if (onReset) {
      onReset();
    }
    // Optionally re-run search to reflect cleared filters
    if (onSearch) {
      onSearch();
    }
  };

  return { locals: formValues, onFilterChange, onClear, onChangeSearchBy, onChangeSearchValue };
};
