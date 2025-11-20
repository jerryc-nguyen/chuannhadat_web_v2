'use client';

import React from 'react';
import SelectField from './SelectField';
import { FieldConfigItem } from './types';

interface FilterFieldBuilderProps<T extends Record<string, any>> {
  fieldConfig: FieldConfigItem<T>;
  value: any;
  onChange: (name: string, value: any) => void;
  showFieldsLabel?: boolean;
}

export default function FilterFieldBuilder<T extends Record<string, any>>({
  fieldConfig,
  value,
  onChange,
  showFieldsLabel = false,
}: FilterFieldBuilderProps<T>) {
  const { type, name, label } = fieldConfig;

  const handleChange = (v: any) => {
    onChange(name as string, v);
  };

  if (type === 'select') {
    return (
      <div className="flex flex-col gap-1">
        {showFieldsLabel && label && <label className="text-xs text-gray-600">{label}</label>}
        <SelectField
          name={name as string}
          isMultiple={fieldConfig.mode === 'multiple'}
          options={fieldConfig.options}
          value={value}
          onChange={handleChange}
          placeholder={fieldConfig.placeholder}
        />
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-xs text-gray-600">{label}</label>}
        <input
          type="text"
          className="h-8 w-full rounded border border-gray-300 p-2"
          placeholder={fieldConfig.placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    );
  }

  return <div>Unsupported field type: {type}</div>;
}
