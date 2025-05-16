'use client';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ButtonGroup } from '@components/ui/button-group';
import { Radio } from '@components/ui/Radio';
import { Separator } from '@components/ui/separator';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';

import { ProductQuery } from '../../data/schemas';
import { DataTableViewOptions } from './view-options';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import HorizontalScroller from '@mobile/ui/HorizontalScroller';
import { createPortal } from 'react-dom';
import { cn } from '@common/utils';
import { useIsMobile } from '@hooks';
import FilterChips from './filter-chips';

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
  onFilterChipsChanged?: (state: Record<string, A>) => void;
  onClickSearch: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onFilterChipsChanged,
  onClickSearch,
}: DataTableToolbarProps<TData>) {
  const form = useFormContext<ProductQuery>();
  const selectedOption = form.watch('visibility');

  const resetFilter = React.useCallback(() => {
    form.setValue('search_value', '');
    form.setValue('visibility', '');
  }, []);

  const showClearFilter = (['search_value', 'visibility'] as const).some(
    (key) => !!form.getValues(key),
  );

  const onSearchTargetChange = (value: string) => {
    console.log('onSearchTargetChange', value);
    form.setValue('search_by', value as A);
  };

  const selectSearchTarget = form.watch('search_by');

  return (
    <div className="flex flex-col space-y-3 px-4 lg:px-0">
      <div className="grid space-x-2 md:grid-cols-2">
        <div className="flex items-center space-x-2">
          <ButtonGroup className="flex-1">
            <SelectSearchTarget
              onChange={onSearchTargetChange}
              selectSearchTarget={selectSearchTarget}
            />
            <Input
              placeholder="Tìm theo mã tin, tiêu đề hoặc ghi chú..."
              {...form.register('search_value')}
              className="w-full"
            />
            <Button variant="default" onClick={onClickSearch}>
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

          <ButtonPostArticle />
        </div>
      </div>

      <HorizontalScroller className="relative my-2 flex gap-2">
        <FilterChips onFilterChipsChanged={onFilterChipsChanged} />
      </HorizontalScroller>

      <Separator className="h-[1px]" />

      <div className="flex gap-2 text-sm md:gap-10 md:text-base">
        <div>Lọc theo: </div>
        <div className="flex gap-2 md:gap-10">
          {options.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              checked={selectedOption === option.value}
              onChange={() => form.setValue('visibility', option.value)}
            />
          ))}
        </div>
      </div>

      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <div className="flex space-x-10">
          <div className="content-center text-sm text-secondary">
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

export function SelectSearchTarget({
  onChange,
  selectSearchTarget,
}: {
  onChange?: (value: string) => void;
  selectSearchTarget: string;
}) {
  return (
    <Select onValueChange={onChange} value={selectSearchTarget}>
      <SelectTrigger className="w-[130px] rounded-r-none border-r-0 pl-2 pr-0 text-sm md:w-[160px] md:pl-3 md:text-base">
        <SelectValue placeholder="Tất cả" />
      </SelectTrigger>
      <SelectContent className="text-sm md:text-base">
        <SelectGroup>
          <SelectLabel>Tìm kiếm theo</SelectLabel>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="code">Mã tin</SelectItem>
          <SelectItem value="title">Tiêu đề</SelectItem>
          <SelectItem value="note">Ghi chú</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const ButtonPostArticle = () => {
  const isMobile = useIsMobile();

  const ContentButton = ({ className }: { className?: string }) => {
    return (
      <Link href="/dashboard/manage-post/new-post" className={className}>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <span className="space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus />
            <p>Đăng tin bán & cho thuê</p>
          </span>
        </Button>
      </Link>
    );
  };

  if (isMobile) {
    return createPortal(
      <div
        className={cn(
          'sticky bottom-0 z-50 flex w-full items-center justify-center bg-white pb-4 pt-4',
        )}
      >
        <ContentButton />
      </div>,
      document.body,
    );
  }

  return <ContentButton />;
};
