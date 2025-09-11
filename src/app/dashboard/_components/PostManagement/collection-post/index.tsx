'use client';
import { searchParamsToObj } from '@common/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadcrumb, useSyncQueryToUrl } from '@common/hooks';
import { merge } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';
import { DASHBOARD_ROUTES } from '@common/router';

export default function TaskDataTable() {
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
