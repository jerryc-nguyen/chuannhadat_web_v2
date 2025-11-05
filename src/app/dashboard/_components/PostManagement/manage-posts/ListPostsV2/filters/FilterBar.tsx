'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import FilterBarBase, { FieldConfigItem } from '@/app/dashboard/_components/datagrid/filters/FilterBarBase';
import { ProductQuery } from '../data/schemas/product-query-schema';
import { usePostsListContext } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/context/PostsListProvider';

const options = {
  placeholder: 'Trạng thái tin',
  visibility: [
    { label: 'Hiển thị', value: 'visible' },
    { label: 'Ẩn', value: 'hidden' },
  ],
};

export default function FilterBar(): React.ReactElement {
  const form = useFormContext<ProductQuery>();
  const ctrl = usePostsListContext();

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
      onSearch={ctrl.onApplyFilter}
      searchFieldOptions={{
        placeholder: 'Tìm theo mã, tiêu đề...'
      }}
    />
  );
}
