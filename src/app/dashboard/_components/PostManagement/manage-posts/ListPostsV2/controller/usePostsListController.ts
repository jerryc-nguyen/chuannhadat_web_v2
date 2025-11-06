'use client';

import { useListController } from '@/app/dashboard/_components/datagrid/controller/useListController';
import ProductApiService from '../apis/product-api';
import { ProductQuery } from '../data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from '../data/type/product-query';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../data/schemas/product-schema';
import { IDashboardListFetcherReturn } from '@common/types';

export function usePostsListController(params?: {
  columns: ColumnDef<Product>[];
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

  const listCtrl = useListController<ProductQuery, Product>({
    columns: columns || [],
    defaultFilters: defaultFilters,
    pageSize,
    fetcher: async ({ filters, pageIndex, pageSize, sorting }): Promise<IDashboardListFetcherReturn<Product>> => {
      const sort = sorting?.[0];
      const query: ProductQuery = {
        ...filters,
        page: pageIndex + 1, // API expects 1-based
        per_page: pageSize,
        sort_by: sort?.id ?? filters.sort_by ?? '',
        sort_direction: sort ? (sort.desc ? 'desc' : 'asc') : filters.sort_direction ?? '',
        aggs_for: 'manage_posts',
      } as ProductQuery;

      const res = await ProductApiService.Filter(query as ProductQuery);
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
    aggs: (listCtrl.query as IDashboardListFetcherReturn<Product>).aggs ?? {},
  };
}
