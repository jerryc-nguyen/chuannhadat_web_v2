'use client';

import React from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import Pagination from '@app/dashboard/_components/datagrid/components/Pagination';

type Props = {
  table: Table<any>;
  className?: string;
  resourceName?: string;
};

const DataTableBase: React.FC<Props> = ({ table, className, resourceName = 'bản ghi' }) => {
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

      <Pagination table={table} position="fixed-fit" resourceName={resourceName} />
    </div>
  );
};

export default DataTableBase;
