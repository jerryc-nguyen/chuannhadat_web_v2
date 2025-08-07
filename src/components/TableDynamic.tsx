"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic imports for TanStack Table components and hooks
const useReactTable = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.useReactTable }))
);

const getCoreRowModel = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.getCoreRowModel }))
);

const getSortedRowModel = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.getSortedRowModel }))
);

const getFilteredRowModel = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.getFilteredRowModel }))
);

const getPaginationRowModel = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.getPaginationRowModel }))
);

const flexRender = lazy(() =>
  import('@tanstack/react-table').then((mod) => ({ default: mod.flexRender }))
);

// Loading fallback for data tables
const TableLoader = () => (
  <div className="w-full">
    <div className="rounded-md border">
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b bg-gray-50 p-4">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-300 rounded flex-1"></div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="border-b p-4">
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((cell) => (
                <div key={cell} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="animate-pulse flex space-x-2">
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>
      <div className="animate-pulse flex space-x-2">
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
);

// Dynamic table hooks wrapper
export const useReactTableDynamic = async (options: any) => {
  const useTable = await import('@tanstack/react-table').then(mod => mod.useReactTable);
  return useTable(options);
};

// Dynamic model functions
export const getTableModels = async () => {
  const [core, sorted, filtered, pagination] = await Promise.all([
    import('@tanstack/react-table').then(mod => mod.getCoreRowModel),
    import('@tanstack/react-table').then(mod => mod.getSortedRowModel),
    import('@tanstack/react-table').then(mod => mod.getFilteredRowModel),
    import('@tanstack/react-table').then(mod => mod.getPaginationRowModel),
  ]);

  return {
    getCoreRowModel: core,
    getSortedRowModel: sorted,
    getFilteredRowModel: filtered,
    getPaginationRowModel: pagination,
  };
};

// Dynamic flex render function
export const flexRenderDynamic = async (cell: any, context: any) => {
  const render = await import('@tanstack/react-table').then(mod => mod.flexRender);
  return render(cell, context);
};

// Simple dynamic table component
export const TableDynamic = ({
  data,
  columns,
  children,
  ...props
}: {
  data: any[];
  columns: any[];
  children?: React.ReactNode;
}) => (
  <Suspense fallback={<TableLoader />}>
    <div className="w-full" {...props}>
      {children}
    </div>
  </Suspense>
);

// Utility function to preload TanStack Table
export const preloadTable = () => {
  import('@tanstack/react-table');
};

// Hook to load table utilities dynamically
export const useTableDynamic = () => {
  return {
    useReactTable: useReactTableDynamic,
    getModels: getTableModels,
    flexRender: flexRenderDynamic,
    preload: preloadTable
  };
};

export default TableDynamic;
