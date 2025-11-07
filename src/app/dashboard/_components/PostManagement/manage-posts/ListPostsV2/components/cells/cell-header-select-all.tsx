'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '../../schemas/ManageProductListSchema';

export const CellHeaderSelectAll: ColumnDef<Product>['header'] = ({ table }) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
    className="translate-y-[2px]"
  />
);
