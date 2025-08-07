"use client";

import { lazy, Suspense, useState, useEffect } from 'react';
import type {
  Table,
  ColumnDef,
  TableOptions,
  RowData
} from '@tanstack/react-table';

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

// Hook to load TanStack Table utilities dynamically
export const useTableDynamic = () => {
  const [tableUtils, setTableUtils] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTableUtils = async () => {
      try {
        const tableModule = await import('@tanstack/react-table');
        if (mounted) {
          setTableUtils({
            useReactTable: tableModule.useReactTable,
            getCoreRowModel: tableModule.getCoreRowModel,
            getSortedRowModel: tableModule.getSortedRowModel,
            getFilteredRowModel: tableModule.getFilteredRowModel,
            getPaginationRowModel: tableModule.getPaginationRowModel,
            flexRender: tableModule.flexRender,
          });
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load @tanstack/react-table:', error);
      }
    };

    loadTableUtils();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    ...tableUtils,
    isLoaded,
    preload: preloadTable
  };
};

// Utility functions for direct imports (when you don't need the hook)
export const getTableModels = async () => {
  const tableModule = await import('@tanstack/react-table');
  return {
    getCoreRowModel: tableModule.getCoreRowModel,
    getSortedRowModel: tableModule.getSortedRowModel,
    getFilteredRowModel: tableModule.getFilteredRowModel,
    getPaginationRowModel: tableModule.getPaginationRowModel,
  };
};

export const flexRenderDynamic = async (cell: any, context: any) => {
  const { flexRender } = await import('@tanstack/react-table');
  return flexRender(cell, context);
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

export default TableDynamic;

// Re-export types for convenience
export type {
  Table,
  ColumnDef,
  TableOptions,
  RowData
} from '@tanstack/react-table';
