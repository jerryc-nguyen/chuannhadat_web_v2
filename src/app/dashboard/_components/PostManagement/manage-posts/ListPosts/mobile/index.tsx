'use client';

import React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { useAdminCollectionPost } from '../hooks/use-collection-post';
import { Product } from '../data/schemas/product-schema';
import { ListPostMobile } from './ListPostMobile';
import { CellHeaderSelectAll, CellMainContent, CellSelect, CellStatus } from '../components/cells';
import { DataTableToolbar } from '../components/datagrid/toolbar';
import { DataTablePagination } from '@dashboard/features/datagrid';
import { searchApi } from '@frontend/features/search/api/searchApi';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import useFilterState from '@frontend/features/search/filter-conditions/hooks/useFilterState';
import { useEffect } from 'react';
import { ProductQuery } from '../data/schemas';
import { useListPostsForm } from '@dashboard/PostManagement/manage-posts/ListPosts/hooks/useListPosts';

const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: CellHeaderSelectAll,
    cell: CellSelect,
  },
  {
    accessorKey: 'images',
    header: ({ column }) => (
      <div className="container">Mô tả</div>
    ),
    cell: CellMainContent,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <div>Thông tin khác</div>,
    cell: CellStatus,
    enableSorting: false,
    enableHiding: false,
  },
];

const MobileDataTable: React.FC = () => {
  const { updateSearchAggs, setIsUseAggOptions } = useSearchAggs();
  const { buildFilterParams } = useFilterState();

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

  const onFilterChipsChanged = async (state: Record<string, any>) => {
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
        isMobile={true}
      />
      <ListPostMobile table={table} contentEmpty="Chưa có bài đăng nào" />
      <DataTablePagination table={table} isMobile={true} />
    </div>
  );
};

const ListPostsMobile: React.FC = () => {
  const { searchForm } = useListPostsForm();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 md:pr-3">
      <FormProvider {...searchForm}>
        <MobileDataTable />
      </FormProvider>
    </div>
  );
};

export default ListPostsMobile;
