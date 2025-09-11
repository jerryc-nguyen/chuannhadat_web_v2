'use client';

import { Table } from '@/components/ui/table';
import { searchApi } from '@common/api/searchApi';
import { DataGridContent, DataGridHeader, DataTablePagination } from '@components/features/data-grid';
import useSearchAggs from '@components/features/search/search-aggs/hooks';
import { useIsMobile } from '@common/hooks';
import useFilterState from '@frontend/CategoryPage/mobile/filter_bds/hooks/useFilterState';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { ProductQuery } from '../data/schemas';
import { Product } from '../data/schemas/product-schema';
import { useAdminCollectionPost } from '../hooks/use-collection-post';
import { ListPostMobile } from '../mobile/ListPostMobile';
import { CellHeaderSelectAll, CellMainContent, CellSelect, CellStatus } from './cells';
import { DataTableColumnHeader } from './datagrid/column-header';
import { DataTableToolbar } from './datagrid/toolbar';
const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: CellHeaderSelectAll,
    cell: CellSelect,
  },

  {
    accessorKey: 'images',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" className="container" />
    ),
    cell: CellMainContent,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thông tin khác" />,
    cell: CellStatus,
    enableSorting: false,
    enableHiding: false,
  },
];

export function DataTable() {
  const { updateSearchAggs, setIsUseAggOptions } = useSearchAggs();
  const { buildFilterParams } = useFilterState();

  const isMobile = useIsMobile();

  const { watch, setValue } = useFormContext<ProductQuery>();

  const page = watch('page') ?? 1;
  const pageSize = watch('per_page') ?? 10;

  const { data: cachedData, refetch } = useAdminCollectionPost();
  const productsList = Array.isArray(cachedData?.data) ? cachedData.data : [];
  const totalRecords: number = cachedData?.pagination?.total_count ?? 0;
  const totalPages: number = cachedData?.pagination?.total_pages ?? 0;
  useEffect(() => {
    if (cachedData?.aggs) {
      updateSearchAggs(cachedData.aggs);
      setIsUseAggOptions(true);
    }
  }, [cachedData?.aggs]);

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: productsList,
    columns: columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;

      // Update both page and per_page values in the form
      setValue('page', newPagination.pageIndex + 1); // update form's page value (1-based index)
      setValue('per_page', newPagination.pageSize); // update form's per_page value
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    meta: {
      totalRecords,
      totalPages,
    },
  });

  const onFilterChipsChanged = async (state: Record<string, A>) => {
    const filterParams = buildFilterParams({ withLocal: false, overrideStates: state });
    const queryOptions = { ...filterParams, only_url: true, search_scope: 'manage_posts' };
    try {
      const response = await searchApi(queryOptions);
      if (!response.listing_url) {
        return;
      }
      setValue('filter_chips', response.listing_url);
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        onFilterChipsChanged={onFilterChipsChanged}
        onClickSearch={refetch}
      />
      {isMobile && <ListPostMobile table={table} contentEmpty="Chưa có bài đăng nào" />}
      {!isMobile && (
        <div className="rounded-md border">
          <Table className="bg-white/30">
            <DataGridHeader table={table} />
            <DataGridContent table={table} columns={columns} />
          </Table>
        </div>
      )}
      <DataTablePagination table={table} isMobile={isMobile} />
    </div>
  );
}
