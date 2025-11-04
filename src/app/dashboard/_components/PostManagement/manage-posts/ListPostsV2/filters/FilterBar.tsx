'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FilterBarBase from '@/app/dashboard/_components/datagrid/filters/FilterBarBase';
import { ProductQuery } from '../data/schemas/product-query-schema';

const options = {
  searchBy: [
    { label: 'Tất cả', value: '' },
    { label: 'Mã', value: 'code' },
    { label: 'Tiêu đề', value: 'title' },
    { label: 'Ghi chú', value: 'note' },
  ],
  visibility: [
    { label: 'Tất cả', value: '' },
    { label: 'Hiển thị', value: 'visible' },
    { label: 'Ẩn', value: 'hidden' },
  ],
};

export default function FilterBar({ onSearch }: { onSearch?: () => void }): React.ReactElement {
  const form = useFormContext<ProductQuery>();

  const fields: Array<
    { type: 'select'; name: keyof ProductQuery; label?: string; options: { label: string; value: string }[]; mode?: 'single' | 'multiple' }
  > = [
      {
        type: 'select',
        name: 'visibility',
        label: 'Trạng thái',
        options: options.visibility,
        mode: 'single',
      },
    ];

  return (
    <FilterBarBase<ProductQuery>
      form={form}
      customFields={fields}
      searchable
      searchByOptions={options.searchBy}
      onSearch={onSearch}
    />
  );
}
