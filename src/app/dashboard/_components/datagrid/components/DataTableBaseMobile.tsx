'use client';

import React from 'react';
import { flexRender, Table } from '@tanstack/react-table';

type Props = {
  table: Table<any>;
  className?: string;
};

const DataTableBase: React.FC<Props> = ({ table, className }) => {
  const rowModel = table.getRowModel();

  return (
    <div className={className ?? ''}>
      {rowModel.rows.map((row) => (
        <div key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <div
              key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}

      {rowModel.rows.length === 0 && (
        <div>
          <div className="px-3 py-6 text-center text-sm text-gray-500">
            No data
          </div>
        </div>
      )}

      {/* Pagination controls (server-side). Consumers may override or hide. */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTableBase;
