import { memo } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import FilterFieldBuilder from './FilterFieldBuilder';
import { useFilterBase } from './useFilterBase';
import { FieldConfigItem } from './types';
import SearchField, { SelectOption } from './SearchField';

export type { FieldConfigItem };

interface FilterBarBaseProps<T extends Record<string, any>> {
  form: UseFormReturn<T, any, any>;
  customFields: FieldConfigItem<T>[];
  onSearch?: () => void;
  isSearching?: boolean;
  searchable?: boolean;
  searchByOptions?: SelectOption[];
}

function FilterBarBase<T extends Record<string, any>>({
  form,
  customFields,
  onSearch,
  isSearching,
  searchable,
  searchByOptions,
}: FilterBarBaseProps<T>) {
  const { locals, onFilterChange, onClear, onChangeSearchBy, onChangeSearchValue } = useFilterBase(
    customFields,
    form,
    searchable,
  );

  return (
    <div className="my-4 flex flex-wrap items-center gap-2 rounded-md bg-gray-100 p-2 dark:bg-gray-800">
      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          }}
          onChangeSearchBy={onChangeSearchBy}
          onChangeSearchValue={onChangeSearchValue}
          onPressEnter={onSearch}
        />
        {customFields.map(f => (
          <FilterFieldBuilder
            key={String(f.name)}
            value={locals[f.name as string]}
            fieldConfig={f}
            onChange={onFilterChange}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={onClear} variant="outline">
          Clear
        </Button>
      </div>
    </div>
  );
}
const MemoizedFilterBarBase = memo(FilterBarBase) as <T extends Record<string, any>>(
  props: FilterBarBaseProps<T>,
) => React.ReactElement;

export default MemoizedFilterBarBase;
