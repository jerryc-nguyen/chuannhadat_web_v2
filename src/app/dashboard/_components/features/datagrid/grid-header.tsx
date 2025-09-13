'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, useReactTable } from '@tanstack/react-table';

interface DataGridHeaderProps<T> {
  table: T extends object ? ReturnType<typeof useReactTable<T>> : never;
}

export function DataGridHeader<T>({ table }: DataGridHeaderProps<T>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
