'use client';

import { searchParamsToObj } from '@common/utils';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSyncQueryToUrl } from '@hooks';
import { merge } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';
import { useSetAtom } from 'jotai';
import React from 'react';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@desktop/dashboard/states/breadcrumbAtom';

export default function TaskDataTable() {
  const searchParams = useSearchParams();

  const searchForm = useForm<ProductQuery>({
    resolver: zodResolver(productQuerySchema),
    defaultValues: merge(productQueryFromDefaultValues, searchParamsToObj(searchParams) as A),
  });

  const formValue = searchForm.watch();
  useSyncQueryToUrl(formValue);
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/manage-post/collection-post',
        title: 'Danh sách tin đăng',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex h-full flex-1 flex-col space-y-8">
      <FormProvider {...searchForm}>
        <ModalPostDetail />
        <DataTable />
      </FormProvider>
    </div>
  );
}
