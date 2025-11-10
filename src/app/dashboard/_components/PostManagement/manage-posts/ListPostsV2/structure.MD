# ListPosts V2 — Structure Guide (Generic Datagrid Separation)

This guide defines a reusable, easy‑to‑extend structure for list pages (Posts, Orders, Users, etc.) and separates generic building blocks into a dedicated `datagrid` directory so they can be reused across listings.

## Goals

- Centralize generic logic (controller, table, filter base) under `datagrid/`.
- Keep views presentational and pure; move logic into a controller hook.
- Reuse the same filter + table state across desktop/mobile.
- Make it trivial to add new entities by swapping columns, filters, and fetcher.
- Maintain compatibility with current `FormProvider` usage.

## Current Baseline (Desktop)

The current desktop page uses `FormProvider` and an internal `DataTable`:

```tsx
'use client';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { useListPostsForm } from './hooks/useListPosts';

const ListPostsDesktop: React.FC = () => {
  const { searchForm } = useListPostsForm();
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 md:pr-3">
      <FormProvider {...searchForm}>
        <DataTable />
      </FormProvider>
    </div>
  );
};
```

V2 keeps this ergonomics: views still render within `FormProvider`, but the form + table + data fetching move into a shared, generic controller located in `datagrid/` to ensure consistency and reuse.

## Directory Layout

### Generic (Reusable across entities)

```
src/app/dashboard/_components/datagrid/
  controller/
    useListController.ts          # generic controller hook
  components/
    DataTableBase.tsx             # pure TanStack Table renderer
  filters/
    FilterBarBase.tsx             # optional base filter UI (label + input patterns)
  types.ts                        # SortItem, ListController types (optional)
```

### Posts‑specific (V2)

```
src/app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/
  controller/
    usePostsListController.ts     # thin wrapper around generic controller (defaults)
  container/
    ListPostsContainer.tsx        # FormProvider + view switch (desktop/mobile)
  views/
    Desktop.tsx                   # uses DataTableBase + FilterBar
    Mobile.tsx                    # uses cards list + FilterBar
  table/
    columns.ts                    # ColumnDef<ProductRow>[] for posts
  filters/
    FilterBar.tsx                 # entity filter bound to react-hook-form
  data/
    schemas.ts                    # TS/Zod row + filter types
  index.tsx                       # desktop entry (can import container)
```

## Generic Controller Responsibilities (datagrid/controller/useListController.ts)

- Filter state: `react-hook-form` for filters; expose `formMethods` and derived `filters`.
- Table state: `@tanstack/react-table` with server‑side pagination/sorting; expose `table`.
- Data fetching: `@tanstack/react-query` with a `fetcher(filters, page, size, sorting)`; return `{ rows, totalCount }`.
- Actions: `setFilters`, `resetFilters`, `setPagination`, `setSorting`.

### Generic Controller Interface

```ts
export type ListController<TFilter, TRow> = {
  formMethods: UseFormReturn<TFilter>;
  table: ReturnType<typeof useReactTable<TRow>>;
  query: { data?: { rows: TRow[]; totalCount: number }; isLoading: boolean; error?: unknown };
  state: {
    filters: TFilter;
    pagination: { pageIndex: number; pageSize: number };
    sorting: { id: string; desc: boolean }[];
  };
  actions: {
    setFilters(next: Partial<TFilter>): void;
    resetFilters(): void;
    setPagination(pageIndex: number, pageSize?: number): void;
    setSorting(sorting: { id: string; desc: boolean }[]): void;
  };
};
```

### Minimal Generic Controller Hook

```ts
// datagrid/controller/useListController.ts
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

export function useListController<TFilter extends object, TRow>(params: {
  defaultFilters: TFilter;
  columns: any[]; // ColumnDef<TRow>[]
  pageSize?: number;
  fetcher: (args: {
    filters: TFilter;
    pageIndex: number;
    pageSize: number;
    sorting: { id: string; desc: boolean }[];
  }) => Promise<{ rows: TRow[]; totalCount: number }>;
}) {
  const { defaultFilters, columns, pageSize = 20, fetcher } = params;
  const formMethods = useForm<TFilter>({ defaultValues: defaultFilters });
  const filters = formMethods.watch();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const query = useQuery({
    queryKey: ['datagrid-list', filters, pagination, sorting],
    queryFn: () =>
      fetcher({ filters, pageIndex: pagination.pageIndex, pageSize: pagination.pageSize, sorting }),
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

  return {
    formMethods,
    table,
    query: { data: query.data, isLoading: query.isLoading, error: query.error },
    state: { filters, pagination, sorting },
    actions: {
      setFilters: (next: Partial<TFilter>) => formMethods.reset({ ...(filters as any), ...next }),
      resetFilters: () => formMethods.reset(defaultFilters),
      setPagination: (pageIndex: number, pageSizeArg = pageSize) =>
        setPagination({ pageIndex, pageSize: pageSizeArg }),
      setSorting: (s: { id: string; desc: boolean }[]) => setSorting(s),
    },
  };
}
```

## Pure, Reusable Components (datagrid)

- `components/DataTableBase.tsx`: generic TanStack Table renderer; no entity logic.
- `filters/FilterBarBase.tsx` (optional): shared input patterns; entity filter can extend/compose.

## Posts V2 — Using the Generic Datagrid

```tsx
// ListPostsV2/index.tsx
import { FormProvider } from 'react-hook-form';
import { useListController } from '@/app/dashboard/_components/datagrid/controller/useListController';
import DataTableBase from '@/app/dashboard/_components/datagrid/components/DataTableBase';
import FilterBar from './filters/FilterBar';
import { desktopColumns } from './table/columns';

export default function ListPostsDesktopV2() {
  const ctl = useListController({
    defaultFilters: { search: '', status: 'all' },
    columns: desktopColumns,
    fetcher: async ({ filters, pageIndex, pageSize, sorting }) => ({ rows: [], totalCount: 0 }),
  });
  return (
    <FormProvider {...ctl.formMethods}>
      <FilterBar />
      <DataTableBase table={ctl.table} />
    </FormProvider>
  );
}
```

## Extending to New Entities (e.g., Users)

- Create `UserListV2/` with `table/columns.ts` and `filters/FilterBar.tsx`.
- Import and use the generic `useListController` from `datagrid/controller`.
- Provide `defaultFilters`, `columns`, and a `fetcher` returning `{ rows, totalCount }`.
- Reuse `DataTableBase` and base filter components.

## Migration From Current Desktop

1. Replace `useListPostsForm` with the generic controller’s `formMethods`.
2. Keep `FormProvider` wrapping; render your entity `FilterBar` and `DataTableBase`.
3. Use the controller’s `table` for rows, pagination, and sorting.

## API Contracts & Types

- `fetcher` returns `{ rows: TRow[]; totalCount: number }`.
- Sorting items: `{ id: string; desc: boolean }[]` mapped from column ids.
- Filters: entity‑specific type; define in `data/schemas.ts` or colocate.

## Performance & UX

- Debounce filter changes if queries are heavy; apply on submit if needed.
- Use `placeholderData` to keep previous rows during pagination.
- Memoize column definitions; avoid recreating arrays in render.

## Testing

- Unit test your `fetcher` and query key composition.
- Verify table pagination and sorting reflect server responses.
- Snapshot test views with stubbed controller data.

---

This separation keeps generic datagrid logic reusable across features while leaving entity folders responsible only for columns, filters, and API wiring.
