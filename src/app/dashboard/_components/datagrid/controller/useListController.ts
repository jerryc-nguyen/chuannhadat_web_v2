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

  const formMethods = useForm<TFilter>({ defaultValues: defaultFilters });
  const filters = formMethods.watch();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState<SortItem[]>([]);

  const query = useQuery({
    queryKey: ['datagrid-list', filters, pagination, sorting],
    queryFn: () =>
      fetcher({
        filters,
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
    setFilters: (next: Partial<TFilter>) => formMethods.reset({ ...(filters as any), ...next }),
    resetFilters: () => formMethods.reset(defaultFilters),
    setPagination: (pageIndex: number, pageSizeArg = pageSize) =>
      setPagination({ pageIndex, pageSize: pageSizeArg }),
    setSorting: (next: SortItem[]) => setSorting(next),
  };

  return {
    formMethods,
    table,
    query: { data: query.data, isLoading: query.isLoading, error: query.error },
    state: { filters, pagination, sorting },
    actions,
  };
}