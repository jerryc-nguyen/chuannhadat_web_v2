'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ManageProductList } from '../../schemas/ManageProductListSchema';

export const CellSelect: ColumnDef<ManageProductList>['cell'] = ({ row }) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
    className="translate-y-[2px]"
  />
);
