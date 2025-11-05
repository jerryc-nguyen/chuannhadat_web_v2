'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FilterBarBase, { FieldConfigItem } from '@/app/dashboard/_components/datagrid/filters/FilterBarBase';
import { ProductQuery } from '../data/schemas/product-query-schema';

const options = {
  placeholder: 'Trạng thái tin',
  visibility: [
    { label: 'Hiển thị', value: 'visible' },
    { label: 'Ẩn', value: 'hidden' },
  ],
};

export default function FilterBar({ onSearch }: { onSearch?: () => void }): React.ReactElement {
  const form = useFormContext<ProductQuery>();

  const fields: Array<FieldConfigItem<ProductQuery>> = [
    {
      type: 'select',
      name: 'visibility',
      label: options.placeholder || 'Trạng thái',
      options: options.visibility,
      mode: 'single',
      placeholder: options.placeholder,
    },
  ];

  return (
    <FilterBarBase<ProductQuery>
      form={form}
      customFields={fields}
      searchable
      onSearch={onSearch}
      searchFieldOptions={{
        placeholder: 'Tìm theo mã, tiêu đề...'
      }}
    />
  );
}
