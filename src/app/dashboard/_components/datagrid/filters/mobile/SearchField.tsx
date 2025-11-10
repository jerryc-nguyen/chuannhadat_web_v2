'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export type SelectOption = { label: string; value: string };

type Props = {
  searchable?: boolean;
  searchBy: {
    name: string;
    label?: string;
    options: SelectOption[];
    value: string;
  };
  searchValue: {
    name?: string;
    label?: string;
    placeholder?: string;
    value?: string;
  };
  onChangeSearchBy: (val: string) => void;
  onChangeSearchValue: (val: string) => void;
  onPressEnter?: () => void;
  showLabel?: boolean;
};

export default function SearchField({
  searchable = true,
  searchBy,
  searchValue,
  onChangeSearchBy,
  onChangeSearchValue,
  onPressEnter,
  showLabel = true,
}: Props) {
  if (!searchable) return null;

  const EMPTY_KEY = '__EMPTY__';
  const hasOptions = Array.isArray(searchBy.options) && searchBy.options.length > 0;
  const mappedOptions = (searchBy.options ?? []).map((opt) => ({
    label: opt.label,
    value: opt.value === '' ? EMPTY_KEY : opt.value,
  }));
  const mappedValue = (searchBy.value ?? '') === '' ? EMPTY_KEY : searchBy.value;

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onPressEnter?.();
    }
  };

  const comboLabel = searchValue.label ?? searchBy.label;

  return (
    <div className="flex flex-col gap-1 w-full" key={`${searchBy.name}-${searchValue.name}`}>
      {showLabel && comboLabel && (
        <label className="inline-block text-xs text-gray-600">{comboLabel}</label>
      )}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
        {hasOptions && (
          <Select
            value={mappedValue}
            onValueChange={(val) => onChangeSearchBy(val === EMPTY_KEY ? '' : val)}
          >
            <SelectTrigger className="h-10 text-sm border rounded-md w-full sm:w-[100px] mb-2 sm:mb-0">
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {mappedOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!hasOptions ? (
          <div className="relative w-full">
            <input
              className="h-10 px-2 pl-9 text-sm border rounded-md w-full"
              placeholder={searchValue.placeholder ?? 'Nhập từ khóa...'}
              name={searchValue.name}
              value={searchValue.value ?? ''}
              onChange={(e) => onChangeSearchValue(e.currentTarget.value)}
              onKeyDown={handleTextKeyDown}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        ) : (
          <input
            className="h-10 px-2 text-sm border rounded-md w-full"
            placeholder={searchValue.placeholder ?? 'Nhập từ khóa...'}
            name={searchValue.name}
            value={searchValue.value ?? ''}
            onChange={(e) => onChangeSearchValue(e.currentTarget.value)}
            onKeyDown={handleTextKeyDown}
          />
        )}
      </div>
    </div>
  );
}
