'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import DataTableBase from '@/app/dashboard/_components/datagrid/components/DataTableBase';
import FilterBar from '../filters/FilterBar';

type Props = { table: Table<any>; onSearch: () => void };

export default function Desktop({ table, onSearch }: Props): React.ReactElement {
  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      <FilterBar onSearch={onSearch} />
      <DataTableBase table={table} />
    </div>
  );
}
