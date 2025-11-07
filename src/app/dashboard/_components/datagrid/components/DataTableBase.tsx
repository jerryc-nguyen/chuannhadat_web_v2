'use client';

import React from 'react';
import { flexRender, Table } from '@tanstack/react-table';

type Props = {
  table: Table<any>;
  className?: string;
};

const DataTableBase: React.FC<Props> = ({ table, className }) => {
  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();

  return (
    <div className={className ?? ''}>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="min-w-full table-fixed border-collapse divide-y divide-gray-200">
          <colgroup>
            {table.getVisibleFlatColumns().map((col) => (
              <col key={col.id} style={{ width: col.getSize() ? `${col.getSize()}px` : undefined }} />
            ))}
          </colgroup>
          <thead className="bg-gray-50">
            {headerGroups.map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-2 text-left text-xs font-semibold text-gray-700 align-top ${header.column.id === 'select' ? 'px-0 text-center' : 'px-3'} ${((header.column.columnDef as any)?.meta?.headerClassName ?? '')}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rowModel.rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`py-2 text-sm text-gray-900 align-top ${cell.column.id === 'select' ? 'px-0 text-center' : 'px-3'} ${((cell.column.columnDef as any)?.meta?.cellClassName ?? '')}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {rowModel.rows.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-sm text-gray-500" colSpan={headerGroups[0]?.headers.length ?? 1}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
