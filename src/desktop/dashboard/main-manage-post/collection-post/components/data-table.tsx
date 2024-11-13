'use client';

import { Table } from '@/components/ui/table';
import { DataGridContent, DataGridHeader, DataTablePagination } from '@components/data-grid';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { DataTableToolbar } from './datagrid/toolbar';
import { ProductQuery } from '../data/schemas';
import { Product } from '../data/schemas/product-schema';
import { useAdminCollectionPost } from '../hooks/use-collection-post';
import { CellHeaderSelectAll, CellMainContent, CellSelect, CellStatus } from './cells';
import { DataTableColumnHeader } from './data-table-column-header';
import useSearchAggs from '@components/search-aggs/hooks';

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

  const { watch, setValue } = useFormContext<ProductQuery>();

  const page = watch('page') ?? 0;
  const pageSize = watch('per_page') ?? 0;

  const { data: cachedData } = useAdminCollectionPost();
  const productsList = Array.isArray(cachedData?.data) ? cachedData.data : [];
  const totalRecords: number = cachedData?.pagination?.total_count ?? 0;
  const totalPages: number = cachedData?.pagination?.total_pages ?? 0;

  if (cachedData?.aggs) {
    updateSearchAggs(cachedData.aggs);
    setIsUseAggOptions(true);
  }

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

  const onFilterChipsChanged = (state: Record<string, A>) => {
    console.log('onFilterChanged', state);
  };

  return (
    <div className="space-y-4">
      {/* ... */}
      <DataTableToolbar table={table} onFilterChipsChanged={onFilterChipsChanged} />
      <div className="rounded-md border">
        <Table className="bg-white/30">
          <DataGridHeader table={table} />
          <DataGridContent table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
