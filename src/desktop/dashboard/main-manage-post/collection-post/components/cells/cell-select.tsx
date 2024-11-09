'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../../data/schemas/product-schema';

export const CellSelect: ColumnDef<Product>['cell'] = ({ row }) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
    className="translate-y-[2px]"
  />
);
