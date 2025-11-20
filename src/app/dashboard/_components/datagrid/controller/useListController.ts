'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSyncPaginationQueryToState } from './useSyncPaginationQueryToState';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { useSyncQueryToUrl } from '@common/hooks/useSyncQueryToUrl';
import { IDashboardListFetcherReturn } from '@common/types';
import { EXCLUDE_FIELDS_TO_URL } from '../constants';

export type SortItem = { id: string; desc: boolean };

export type ListControllerParams<TFilter extends object, TRow> = {
  defaultFilters: TFilter;
  columns: ColumnDef<TRow, unknown>[];
  pageSize?: number;
  fetcher: (args: {
    filters: TFilter;
    pageIndex: number;
    pageSize: number;
    sorting: SortItem[];
  }) => Promise<IDashboardListFetcherReturn<TRow>>;
};

export type UseListControllerReturn<TFilter extends object, TRow> = {
  formMethods: ReturnType<typeof useForm<TFilter>>;
  table: ReturnType<typeof useReactTable<TRow>>;
  query: IDashboardListFetcherReturn<TRow>;
  state: {
    filters: TFilter;
    pagination: { pageIndex: number; pageSize: number };
    sorting: SortItem[];
    totalCount: number;
  };
  actions: {
    setFilters: (next: Partial<TFilter>) => void;
    submitFilters: () => void;
    resetFilters: () => void;
    setPagination: (pageIndex: number, pageSizeArg?: number) => void;
    setSorting: (next: SortItem[]) => void;
  };
};

export function useListController<TFilter extends object, TRow>(
  params: ListControllerParams<TFilter, TRow>
): UseListControllerReturn<TFilter, TRow> {
  const { defaultFilters, columns, pageSize = 20, fetcher } = params;

  const formMethods = useForm<TFilter>({ defaultValues: defaultFilters as any });
  const filters = formMethods.watch(); // Keep watching for UI state

  // Submitted filters for querying
  const [submittedFilters, setSubmittedFilters] = useState<TFilter>(defaultFilters);

  // Rollback functionality to restore form values from URL parameters
  useEffect(() => {
    // Read initial values from URL if they exist
    const searchParams = new URLSearchParams(window.location.search);
    const urlParams = Object.fromEntries(searchParams.entries());

    if (Object.keys(urlParams).length > 0) {
      // Merge URL params with default filters, prioritizing URL values
      const mergedFilters = { ...defaultFilters, ...urlParams };
      formMethods.reset(mergedFilters as any);
      setSubmittedFilters(mergedFilters as TFilter);
    }
  }, []);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState<SortItem[]>([]);

  // React to URL query changes via reusable hook: enable direct editing of ?page & ?per_page
  useSyncPaginationQueryToState({
    pageSizeDefault: pageSize,
    pagination,
    setPagination,
    setFormValue: formMethods.setValue as any,
  });

  const syncObject: Record<string, any> = {
    ...submittedFilters, page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  } as any;

  useSyncQueryToUrl(syncObject, EXCLUDE_FIELDS_TO_URL);

  const query = useQuery({
    // Depend on submittedFilters, not live filters
    queryKey: ['datagrid-list', submittedFilters, pagination, sorting],
    queryFn: () =>
      fetcher({
        filters: submittedFilters, // Use submitted filters for fetcher
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
      }),
    placeholderData: (prev) => prev ?? undefined,
  });

  const totalCount = query.data?.pagination?.total_count ?? 0;

  const table = useReactTable<TRow>({
    data: query.data?.rows ?? [],
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) =>

      setPagination((prev) => {
        const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
        // Keep form state in sync with table pagination (API uses 1-based page)
        try {
          (formMethods.setValue as any)('page', next.pageIndex + 1);
          (formMethods.setValue as any)('per_page', next.pageSize);
        } catch (_) {
          // no-op: type constraints on generic filters may not include these fields
        }
        return next;
      }),
    onSortingChange: (updater) =>
      setSorting((prev) => (typeof updater === 'function' ? (updater as any)(prev) : updater)),
    getCoreRowModel: getCoreRowModel(),
    meta: { totalCount },
  });

  const actions = {
    // This now just updates the form state, doesn't trigger query
    setFilters: (next: Partial<TFilter>) => formMethods.reset({ ...(filters as any), ...next }),

    submitFilters: () => {
      setSubmittedFilters(formMethods.getValues());
    },

    resetFilters: () => {
      formMethods.reset(defaultFilters);
      setSubmittedFilters(defaultFilters); // Also reset submitted filters
    },
    setPagination: (pageIndex: number, pageSizeArg = pageSize) => {
      // Update local pagination state
      setPagination({ pageIndex, pageSize: pageSizeArg });
      // Also mirror into form state for URL/query param syncing
      try {
        (formMethods.setValue as any)('page', pageIndex + 1);
        (formMethods.setValue as any)('per_page', pageSizeArg);
      } catch (_) {
        // ignore if filter type doesn't declare these fields
      }
    },
    setSorting: (next: SortItem[]) => setSorting(next),
  };

  return {
    formMethods,
    table,
    query: query.data ?? ({} as IDashboardListFetcherReturn<TRow>),
    state: { filters, pagination, sorting, totalCount }, // 'filters' is still the live form state for the UI
    actions,
  };
}
