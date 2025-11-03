'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
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

export default function FilterBar(): React.ReactElement {
  const { register, setValue, watch } = useFormContext<ProductQuery>();

  // Keep page reset to 1 when filters change
  const onChangeResetPage = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name as any, value as any);
    setValue('page', 1);
  };

  const searchBy = watch('search_by');
  const searchValue = watch('search_value');
  const visibility = watch('visibility');

  return (
    <div className="mb-3 flex flex-wrap items-end gap-3">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Tìm theo</label>
        <select
          className="rounded border px-2 py-1 text-sm"
          {...register('search_by')}
          value={searchBy ?? ''}
          onChange={onChangeResetPage}
        >
          {options.searchBy.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Giá trị tìm kiếm</label>
        <input
          className="w-64 rounded border px-2 py-1 text-sm"
          placeholder="Nhập từ khóa..."
          {...register('search_value')}
          value={searchValue ?? ''}
          onChange={onChangeResetPage}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600">Trạng thái</label>
        <select
          className="rounded border px-2 py-1 text-sm"
          {...register('visibility')}
          value={visibility ?? ''}
          onChange={onChangeResetPage}
        >
          {options.visibility.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}