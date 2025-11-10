import { FieldConfigItem } from './types';
import { Path, UseFormReturn } from 'react-hook-form';

export const useFilterBase = <T extends Record<string, any>>(
  customFields: FieldConfigItem<T>[],
  form: UseFormReturn<T, any, undefined>,
  searchable?: boolean,
  onSearch?: () => void,
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
    const defaultValues: any = {};
    customFields.forEach(f => {
      if (f.type === 'select' && f.mode === 'multiple') {
        defaultValues[f.name as string] = [];
      } else {
        defaultValues[f.name as string] = '';
      }
    });
    if (searchable) {
      defaultValues.search_by = '';
      defaultValues.search_value = '';
    }
    form.reset(defaultValues);
    if (onSearch) {
      onSearch();
    }
  };

  return { locals: formValues, onFilterChange, onClear, onChangeSearchBy, onChangeSearchValue };
};
