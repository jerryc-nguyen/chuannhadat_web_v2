'use client';

import { searchParamsToObj } from '@common/utils';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadcrumb, useSyncQueryToUrl } from '@hooks';
import { merge } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';

export default function TaskDataTable() {
  useBreadcrumb([
    {
      link: '/manage-post/collection-post',
      title: 'Danh sách tin đăng',
      isActive: true,
    },
  ]);

  const searchParams = useSearchParams();

  const searchForm = useForm<ProductQuery>({
    resolver: zodResolver(productQuerySchema),
    defaultValues: merge(productQueryFromDefaultValues, searchParamsToObj(searchParams) as A),
  });

  const formValue = searchForm.watch();
  useSyncQueryToUrl(formValue);

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 pr-3">
      <FormProvider {...searchForm}>
        <ModalPostDetail />
        <DataTable />
      </FormProvider>
    </div>
  );
}
