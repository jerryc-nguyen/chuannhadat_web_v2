'use client';
import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ButtonGroup } from '@components/ui/button-group';
import { Radio } from '@components/ui/Radio';
import { Separator } from '@components/ui/separator';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { listChipsQuery } from '../constant/list_chips_query';
import { ProductQuery } from '../data/schemas';
import { DataTableViewOptions } from './data-table-view-options';

import FilterChip from '@desktop/home/components/FilterChip';

const options = [
  {
    label: 'Tất cả',
    value: '',
  },
  {
    label: 'Tin ẩn',
    value: 'hidden',
  },
  {
    label: 'Tin hiện',
    value: 'visible',
  },
] as const;

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onFilterChipsChanged?: (state: Record<string, A>) => void
}

export function DataTableToolbar<TData>({ table, onFilterChipsChanged }: DataTableToolbarProps<TData>) {
  const form = useFormContext<ProductQuery>();
  const selectedOption = form.watch('visibility');

  const resetFilter = React.useCallback(() => {
    form.setValue('keyword', '');
    form.setValue('visibility', '');
  }, []);

  const showClearFilter = (['keyword', 'visibility'] as const).some((key) => !!form.getValues(key));

  return (
    <div className="flex flex-col space-y-3">
      <div className="grid space-x-2 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <ButtonGroup className="flex-1">
            <Input
              placeholder="Tìm theo mã tin, tiêu đề hoặc ghi chú..."
              {...form.register('keyword')}
              className="w-full"
            />
            <Button variant="default">
              <Search size={16} />
            </Button>
          </ButtonGroup>
        </div>

        <div className={`flex ${!showClearFilter ? 'justify-end' : 'justify-between'}`}>
          {showClearFilter ? (
            <Button variant="ghost" onClick={resetFilter} className="px-2 lg:px-3">
              Xóa lọc
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <></>
          )}

          <Link href="/dashboard/manage-post/new-post" target="_blank">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <span className="space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus />
                <p>Đăng tin bán & cho thuê</p>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative my-2 flex flex-wrap gap-2">
        {listChipsQuery.map((item) => (
          <FilterChip filterChipItem={item} key={item.id} onChange={onFilterChipsChanged} />
        ))}
      </div>

      <Separator className="h-[1px]" />

      <div className="flex space-x-10">
        <span>Lọc theo: </span>
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            checked={selectedOption === option.value}
            onChange={() => form.setValue('visibility', option.value)}
          />
        ))}
      </div>

      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <div className="flex space-x-10">
          <div className="content-center text-sm text-muted-foreground">
            <span>
              {table.getFilteredSelectedRowModel().rows.length} /{' '}
              {table.getFilteredRowModel().rows.length} đã chọn.
            </span>
          </div>

          <DataTableViewOptions table={table} />
          {/* <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <span className="bg-primary text-primary-foreground hover:bg-primary/90 space-x-2">
                <p>Thao tác hàng loạt</p>
              </span>
            </Button> */}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
