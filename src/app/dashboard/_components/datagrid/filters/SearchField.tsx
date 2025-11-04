'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    name: string;
    label?: string;
    placeholder?: string;
    value: string;
  };
  onChangeSearchBy: (val: string) => void;
  onChangeSearchValue: (val: string) => void;
  onPressEnter?: () => void;
};

export default function SearchField({
  searchable = true,
  searchBy,
  searchValue,
  onChangeSearchBy,
  onChangeSearchValue,
  onPressEnter,
}: Props) {
  if (!searchable) return null;

  const EMPTY_KEY = '__EMPTY__';
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

  return (
    <>
      <div className="flex flex-col" key={searchBy.name}>
        {searchBy.label && <label className="text-xs text-gray-600">{searchBy.label}</label>}
        <Select
          value={mappedValue}
          onValueChange={(val) => onChangeSearchBy(val === EMPTY_KEY ? '' : val)}
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
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
      </div>

      <div className="flex flex-col" key={searchValue.name}>
        {searchValue.label && <label className="text-xs text-gray-600">{searchValue.label}</label>}
        <input
          className="w-64 rounded border px-2 py-1 text-sm"
          placeholder={searchValue.placeholder ?? 'Nhập từ khóa...'}
          name={searchValue.name}
          value={searchValue.value ?? ''}
          onChange={(e) => onChangeSearchValue(e.currentTarget.value)}
          onKeyDown={handleTextKeyDown}
        />
      </div>
    </>
  );
}