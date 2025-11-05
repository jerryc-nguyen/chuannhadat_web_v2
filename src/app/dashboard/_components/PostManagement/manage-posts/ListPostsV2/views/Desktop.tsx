'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import DataTableBase from '@/app/dashboard/_components/datagrid/components/DataTableBase';
import FilterBar from '../filters/FilterBar';
import FilterChipsDesktop from '@frontend/CategoryPage/components/FilterChips';
import { listChipsQuery } from '../constant/list_chips_query';

type Props = { table: Table<any>; onSearch: () => void };

export default function Desktop({ table, onSearch }: Props): React.ReactElement {

  return (
    <div className="flex h-full flex-1 flex-col">
      <FilterBar onSearch={onSearch} />
      <FilterChipsDesktop chipOptions={listChipsQuery} className="bg-none mb-4" />
      <DataTableBase table={table} />
    </div>
  );
}
