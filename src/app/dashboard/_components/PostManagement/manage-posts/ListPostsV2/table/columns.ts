import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../data/schemas/product-schema';

export const postsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => String(row.original.id ?? ''),
    enableSorting: true,
  },
  {
    accessorKey: 'title',
    header: 'Tiêu đề',
    cell: ({ row }) => String(row.original.title ?? ''),
    enableSorting: true,
  },
  {
    accessorKey: 'visibility',
    header: 'Trạng thái',
    cell: ({ row }) => String(row.original.visibility ?? ''),
    enableSorting: true,
  },
];