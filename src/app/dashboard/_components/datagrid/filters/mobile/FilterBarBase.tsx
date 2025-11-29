import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FilterFieldBuilder from './FilterFieldBuilder';
import { useFilterBase } from '../useFilterBase';
import { FieldConfigItem } from '../types';
import SearchField, { SelectOption } from './SearchField';

export type { FieldConfigItem };

interface FilterBarBaseProps<T extends Record<string, any>> {
  form: UseFormReturn<T, any, any>;
  customFields: FieldConfigItem<T>[];
  onSearch?: () => void;
  isSearching?: boolean;
  searchable?: boolean;
  searchByOptions?: SelectOption[];
  searchFieldOptions?: Record<string, any>
  showFieldsLabel?: boolean;
  onClearFilters?: () => void;
}

function FilterBarBase<T extends Record<string, any>>({
  form,
  customFields,
  onSearch,
  isSearching,
  searchable,
  searchByOptions,
  searchFieldOptions,
  showFieldsLabel = false,
  onClearFilters,
}: FilterBarBaseProps<T>) {
  const { locals, onFilterChange, onChangeSearchBy, onChangeSearchValue } = useFilterBase(
    customFields,
    form,
    searchable,
    onSearch,
  );

  return (
    <div className="my-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-wrap items-end gap-4">
        <SearchField
          searchable={searchable}
          searchBy={{
            name: 'search_by',
            options: searchByOptions ?? [],
            value: (locals as any)?.search_by ?? '',
          }}
          searchValue={{
            name: 'search_value',
            value: (locals as any)?.search_value ?? '',
            label: 'Tìm kiếm',
            ...searchFieldOptions
          }}
          onChangeSearchBy={onChangeSearchBy}
          onChangeSearchValue={onChangeSearchValue}
          onPressEnter={onSearch}
          showLabel={showFieldsLabel}
        />
        {customFields.map(f => (
          <FilterFieldBuilder
            key={String(f.name)}
            value={locals[f.name as string]}
            fieldConfig={f}
            onChange={onFilterChange}
            showFieldsLabel={showFieldsLabel}
          />
        ))}
        <div className="flex items-center gap-3">
          <Button onClick={onSearch} disabled={isSearching} className="h-9 px-4">
            {isSearching ? 'Searching...' : 'Áp dụng'}
          </Button>
          <Button onClick={onClearFilters} variant="outline" className="h-9 px-4">
            Xóa lọc
          </Button>
        </div>
      </div>
    </div>
  );
}
const MemoizedFilterBarBase = memo(FilterBarBase) as <T extends Record<string, any>>(
  props: FilterBarBaseProps<T>,
) => React.ReactElement;

export default MemoizedFilterBarBase;
