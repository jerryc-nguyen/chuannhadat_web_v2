'use client';

import { objectToQueryString, searchParamsToObj } from '@common/utils';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import { zodResolver } from '@hookform/resolvers/zod';
import { merge } from 'lodash-es';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';
import { useAdminCollectionPost } from './hooks/use-collection-post';

export default function TaskDataTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ProductQuery>({
    resolver: zodResolver(productQuerySchema),
    defaultValues: merge(productQueryFromDefaultValues, searchParamsToObj(searchParams) as A),
  });

  const formValue = form.watch();

  const result = useAdminCollectionPost();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    router.push(pathname + '?' + objectToQueryString(formValue, searchParams));
  }, [formValue, pathname, createQueryString, router]);

  return (
    <div className="flex h-full flex-1 flex-col space-y-8">
      <FormProvider {...form}>
        <ModalPostDetail />
        <DataTable />
      </FormProvider>
    </div>
  );
}
