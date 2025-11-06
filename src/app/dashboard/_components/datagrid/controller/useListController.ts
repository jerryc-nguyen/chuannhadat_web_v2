'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { useSyncQueryToUrl } from '@common/hooks/useSyncQueryToUrl';
import { IDashboardListFetcherReturn } from '@common/types';

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

  // Sync submitted filters to URL
  useSyncQueryToUrl(submittedFilters as Record<string, any>);

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

  const table = useReactTable<TRow>({
    data: query.data?.rows ?? [],
    columns,
    pageCount: Math.ceil((query.data?.pagination?.total_count ?? 0) / pagination.pageSize),
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) =>
      setPagination((prev) => (typeof updater === 'function' ? (updater as any)(prev) : updater)),
    onSortingChange: (updater) =>
      setSorting((prev) => (typeof updater === 'function' ? (updater as any)(prev) : updater)),
    getCoreRowModel: getCoreRowModel(),
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
    setPagination: (pageIndex: number, pageSizeArg = pageSize) =>
      setPagination({ pageIndex, pageSize: pageSizeArg }),
    setSorting: (next: SortItem[]) => setSorting(next),
  };

  return {
    formMethods,
    table,
    query: query.data ?? ({} as IDashboardListFetcherReturn<TRow>),
    state: { filters, pagination, sorting }, // 'filters' is still the live form state for the UI
    actions,
  };
}
