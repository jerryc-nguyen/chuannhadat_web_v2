'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { useListPostsForm } from './hooks/useListPosts';

const ListPostsDesktop: React.FC = () => {
  const { searchForm } = useListPostsForm();

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 md:pr-3">
      <FormProvider {...searchForm}>
        <DataTable />
      </FormProvider>
    </div>
  );
};

export default ListPostsDesktop;
