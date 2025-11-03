'use client';

import React from 'react';
import DataTableBase from '@/app/dashboard/_components/datagrid/components/DataTableBase';
import { postsColumns } from '../table/columns';
import { usePostsListController } from '../controller/usePostsListController';
import FilterBar from '../filters/FilterBar';

export default function Desktop(): React.ReactElement {
  const ctl = usePostsListController({ columns: postsColumns });

  return (
    <div className="flex h-full flex-1 flex-col space-y-4">
      <FilterBar />
      <DataTableBase table={ctl.table} />
    </div>
  );
}