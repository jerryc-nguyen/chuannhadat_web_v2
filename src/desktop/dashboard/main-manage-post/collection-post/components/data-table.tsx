'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { DataTablePagination } from '../components/data-table-pagination';
import { DataTableToolbar } from '../components/data-table-toolbar';
import { ProductQuery } from '../data/schemas';
import { Product } from '../data/schemas/product-schema';
import { useAdminCollectionPost } from '../hooks/use-collection-post';
import { productsListAppliedAtom } from '../states';
import { CellHeaderSelectAll, CellMainContent, CellSelect, CellStatus } from './cells';
import { DataTableColumnHeader } from './data-table-column-header';

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
  const { watch, setValue } = useFormContext<ProductQuery>();

  const page = watch('page') ?? 0;
  const pageSize = watch('per_page') ?? 0;
  
  const { data: cachedData } = useAdminCollectionPost();
  const productsList = Array.isArray(cachedData?.data) ? cachedData.data : [];
  const totalRecords = cachedData?.pagination?.total_count ?? 0;
  const totalPages = cachedData?.pagination?.total_pages ?? 0;

  const [productsListApplied, setProductsListApplied] = useAtom(productsListAppliedAtom);

  React.useEffect(() => {
    if (!cachedData) return;

    setProductsListApplied({
      productsList,
      totalRecords,
      totalPages,
    });
  }, [cachedData, setProductsListApplied]);

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: productsListApplied.productsList,
    columns: columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    pageCount: productsListApplied.totalPages,
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
  });

  return (
    <div className="space-y-4">
      {/* ... */}
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table className="bg-white/30">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chưa có bản ghi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
