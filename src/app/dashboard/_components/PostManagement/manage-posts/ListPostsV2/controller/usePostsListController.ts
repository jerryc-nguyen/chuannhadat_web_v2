'use client';

import { useListController } from '@/app/dashboard/_components/datagrid/controller/useListController';
import ProductApiService from '../apis/product-api';
import { ProductQuery } from '../data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from '../data/type/product-query';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../data/schemas/product-schema';

export function usePostsListController(params?: {
  columns: ColumnDef<Product>[];
  pageSize?: number;
}) {
  const { columns, pageSize = productQueryFromDefaultValues.per_page } = params || {};

  // Ensure all required ProductQuery fields exist in defaults
  const defaultFiltersFull: ProductQuery = {
    ...productQueryFromDefaultValues,
    // Ensure discriminated unions are correctly typed
    visibility: '' as 'hidden' | 'visible' | '',
    search_by: '' as 'code' | 'title' | 'note' | 'all' | '',
    filter_chips: '',
    aggs_for: 'manage_posts',
    min_price: '',
    max_price: '',
    min_area: '',
    max_area: '',
  };

  const listCtrl = useListController<ProductQuery, Product>({
    columns: columns || [],
    defaultFilters: defaultFiltersFull,
    pageSize,
    fetcher: async ({ filters, pageIndex, pageSize, sorting }) => {
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
      const payload = res as unknown as {
        aggs?: Record<string, any>;
        data?: Product[];
        pagination?: { total_count?: number; total_pages?: number };
      };

      return {
        aggs: payload?.aggs ?? {},
        rows: Array.isArray(payload?.data) ? payload.data! : [],
        totalCount: payload?.pagination?.total_count ?? 0,
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
    aggs: listCtrl.query.data?.aggs ?? {},
  };
}
