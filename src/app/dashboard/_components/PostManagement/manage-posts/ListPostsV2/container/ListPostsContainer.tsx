'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { usePostsListController } from '../controller/usePostsListController';
import { postsColumns } from '../table/columns';
import Desktop from '../views/Desktop';

export default function ListPostsContainer(): React.ReactElement {
  const ctl = usePostsListController({ columns: postsColumns });
  return (
    <div className="flex h-full flex-1 flex-col space-y-4 md:pr-3">
      <FormProvider {...ctl.formMethods}>
        <Desktop />
      </FormProvider>
    </div>
  );
}