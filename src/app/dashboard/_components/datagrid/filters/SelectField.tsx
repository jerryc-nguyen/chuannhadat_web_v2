'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SelectOption } from './SearchField';
import { ClearButton } from '@/components/ui/clear-button';
import { useState, useEffect } from 'react';

type SelectFieldProps = {
  placeholder?: string;
  name: string;
  label?: string;
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isMultiple?: boolean;
  className?: string;
  isMobile?: boolean;
};

export default function SelectField({
  placeholder,
  name,
  label,
  options,
  value,
  onChange,
  className,
  isMobile = false
}: SelectFieldProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <div className={`flex flex-col ${className ?? ''}`} key={name}>
      {label && <label className="text-xs text-gray-600">{label}</label>}
      <div className={isMobile ? "relative w-full" : "relative"}>
        <Select
          value={internalValue as string}
          onValueChange={(val) => {
            setInternalValue(val);
            onChange(val);
          }}
        >
          <SelectTrigger className={`${isMobile ? "w-full" : "w-[180px]"} h-10 text-sm ${!internalValue ? 'text-gray-500' : ''}`}>
            <SelectValue placeholder={placeholder ?? 'Chọn...'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {internalValue && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <ClearButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setInternalValue('');
                onChange('');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
