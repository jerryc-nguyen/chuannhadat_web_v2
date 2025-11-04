'use client';

import React from 'react';
import SelectField from './SelectField';
import { FieldConfigItem } from './types';

interface FilterFieldBuilderProps<T extends Record<string, any>> {
  fieldConfig: FieldConfigItem<T>;
  value: any;
  onChange: (name: string, value: any) => void;
}

export default function FilterFieldBuilder<T extends Record<string, any>>({
  fieldConfig,
  value,
  onChange,
}: FilterFieldBuilderProps<T>) {
  const { type, name } = fieldConfig;

  const handleChange = (v: any) => {
    onChange(name as string, v);
  };

  if (type === 'select') {
    return (
      <SelectField
        name={name as string}
        isMultiple={fieldConfig.mode === 'multiple'}
        options={fieldConfig.options}
        value={value}
        onChange={handleChange}
      />
    );
  }

  if (type === 'text') {
    return (
      <input
        type="text"
        className="h-8 w-full rounded border border-gray-300 p-2"
        placeholder={fieldConfig.placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  }

  return <div>Unsupported field type: {type}</div>;
}