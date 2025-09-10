'use client';
import { searchParamsToObj } from '@common/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadcrumb, useSyncQueryToUrl } from '@hooks';
import { merge } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './collection-post/components/data-table';
import { ProductQuery, productQuerySchema } from './collection-post/data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './collection-post/data/type/product-query';
import { DASHBOARD_ROUTES } from '@common/router';

export default function PostManagement() {
  useBreadcrumb([
    {
      link: DASHBOARD_ROUTES.posts.index,
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
    <div className="flex h-full flex-1 flex-col space-y-8 md:pr-3">
      <FormProvider {...searchForm}>
        <DataTable />
      </FormProvider>
    </div>
  );
}
