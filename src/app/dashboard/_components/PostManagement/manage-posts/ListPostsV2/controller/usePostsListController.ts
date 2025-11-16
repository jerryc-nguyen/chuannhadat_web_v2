'use client';

import { useListController } from '@/app/dashboard/_components/datagrid/controller/useListController';
import ProductApiService from '../apis/product-api';
import { ProductQuery } from '../schemas/ProductQuerySchema';
import { productQueryFromDefaultValues } from '../types/product-query';
import { ColumnDef } from '@tanstack/react-table';
import { ManageProductList } from '../schemas/ManageProductListSchema';
import { IDashboardListFetcherReturn } from '@common/types';

export function usePostsListController(params?: {
  columns: ColumnDef<ManageProductList>[];
  pageSize?: number;
}) {
  const { columns, pageSize = productQueryFromDefaultValues.per_page } = params || {};

  // Ensure all required ProductQuery fields exist in defaults
  const defaultFilters: ProductQuery = {
    visibility: '' as 'hidden' | 'visible' | '',
    search_by: '' as 'code' | 'title' | 'note' | 'all' | '',
    filter_chips: '',
    aggs_for: 'manage_posts'
  };

  const listCtrl = useListController<ProductQuery, ManageProductList>({
    columns: columns || [],
    defaultFilters: defaultFilters,
    pageSize,
    fetcher: async ({ filters, pageIndex, pageSize, sorting }): Promise<IDashboardListFetcherReturn<ManageProductList>> => {
      const sort = sorting?.[0];
      const query: Record<string, any> = {
        ...filters,
        page: pageIndex + 1, // API expects 1-based
        per_page: pageSize,
        sort_by: sort?.id ?? filters.sort_by ?? '',
        sort_direction: sort ? (sort.desc ? 'desc' : 'asc') : filters.sort_direction ?? '',
        aggs_for: 'manage_posts',
      }

      const res = await ProductApiService.Filter(query);
      // Axios instance likely returns payload directly
      const payload = res as Record<string, any>;
      return {
        aggs: payload?.aggs ?? {},
        rows: Array.isArray(payload?.data) ? payload.data : [],
        pagination: payload?.pagination ?? {},
      };
    },
  });


  return {
    ...listCtrl,
    formMethods: listCtrl.formMethods,
    table: listCtrl.table,
    query: listCtrl.query,
    state: listCtrl.state,
    actions: listCtrl.actions,
    aggs: (listCtrl.query as IDashboardListFetcherReturn<ManageProductList>).aggs ?? {},
  };
}
