'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SelectOption } from './SearchField';

type SelectFieldProps = {
  name: string;
  label?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isMultiple?: boolean;
};

export default function SelectField({
  name,
  label,
  options,
  value,
  onChange,
  isMultiple,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col" key={name}>
      {label && <label className="text-xs text-gray-600">{label}</label>}
      {isMultiple ? (
        <select
          className="rounded border px-2 py-1 text-sm"
          name={name}
          multiple
          value={value as string[]}
          onChange={(e) => {
            const selected = Array.from(e.currentTarget.selectedOptions).map((o) => o.value);
            onChange(selected);
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        (() => {
          const EMPTY_KEY = '__EMPTY__';
          const mappedOptions = options.map((opt) => ({
            label: opt.label,
            value: opt.value === '' ? EMPTY_KEY : opt.value,
          }));
          const mappedValue = value === '' ? EMPTY_KEY : value;
          return (
            <Select
              value={mappedValue as string}
              onValueChange={(val) => onChange(val === EMPTY_KEY ? '' : val)}
            >
              <SelectTrigger className="w-[180px] h-10 text-sm">
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
          );
        })()
      )}
    </div>
  );
}
