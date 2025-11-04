'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table';

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
  }) => Promise<{ rows: TRow[]; totalCount: number }>;
};

export function useListController<TFilter extends object, TRow>(
  params: ListControllerParams<TFilter, TRow>
) {
  const { defaultFilters, columns, pageSize = 20, fetcher } = params;

  const formMethods = useForm<TFilter>({ defaultValues: defaultFilters as any });
  const filters = formMethods.watch(); // Keep watching for UI state

  // Submitted filters for querying
  const [submittedFilters, setSubmittedFilters] = useState<TFilter>(defaultFilters);

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
    pageCount: Math.ceil((query.data?.totalCount ?? 0) / pagination.pageSize),
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

    // New action to apply filters and trigger query
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
    query: { data: query.data, isLoading: query.isLoading, error: query.error },
    state: { filters, pagination, sorting }, // 'filters' is still the live form state for the UI
    actions,
  };
}