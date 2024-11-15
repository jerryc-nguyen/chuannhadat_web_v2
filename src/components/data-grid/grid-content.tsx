'use client';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, useReactTable } from '@tanstack/react-table';
import * as React from 'react';

interface DataGridContentProps<T> {
  table: T extends object ? ReturnType<typeof useReactTable<T>> : never;
  contentEmpty?: React.ReactNode;
  columns: ColumnDef<T>[];
}

export function DataGridContent<T>({ table, contentEmpty = 'Chưa có bản ghi', columns }: DataGridContentProps<T>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {contentEmpty}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
