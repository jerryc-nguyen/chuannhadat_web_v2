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
import { DataTableColumnHeader } from './datagrid/column-header';
import useSearchAggs from '@components/search-aggs/hooks';
import { FilterFieldName } from '@models';
import { get } from 'lodash-es';

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

  const page = watch('page') ?? 1;
  const pageSize = watch('per_page') ?? 10;

  const { data: cachedData, refetch } = useAdminCollectionPost();
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
    const listKey = Object.keys(state);
    console.log({ listKey });
    listKey.forEach((key) => {
      switch (key) {
        case FilterFieldName.Area: {
          setValue("min_area", get(state, [key, 'params', "min_area"]));
          setValue("max_area", get(state, [key, 'params', "max_area"]));
          break;
        }
        case FilterFieldName.Bath: {
          setValue('bathrooms_count', get(state, [key, 'value']));
          break;
        }
        case FilterFieldName.Bed: {
          setValue('bedrooms_count', get(state, [key, 'value']));
          break;
        }
        case FilterFieldName.BusCatType: {
          setValue('business_type', get(state, [key, 'params', "business_type"]));
          setValue('category_type', get(state, [key, 'params', "category_type"]));
          break;
        }
        case FilterFieldName.BusinessType: {
          break;
        }
        case FilterFieldName.CategoryType: {
          break;
        }
        case FilterFieldName.City: {
          setValue("city_id", get(state, [key, 'value']));
          break;
        }
        case FilterFieldName.Direction: {
          setValue("directions", get(state, [key, 'params', "direction"]));
          break;
        }
        case FilterFieldName.District: {
          setValue("district_id", get(state, [key, 'value']));
          break;
        }
        case FilterFieldName.Price: {
          setValue("min_price", get(state, [key, 'params', "min_price"]));
          setValue("max_price", get(state, [key, 'params', "max_price"]));
          break;
        }
        case FilterFieldName.Sort: {
          setValue("sort_direction", get(state, [key, 'value']));
          break;
        }
        case FilterFieldName.Ward: {
          setValue("ward_id", get(state, [key, 'value']));
          break;
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* ... */}
      <DataTableToolbar table={table} onFilterChipsChanged={onFilterChipsChanged} onClickSearch={refetch} />
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
