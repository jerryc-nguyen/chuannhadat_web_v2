'use client';

import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import { zodResolver } from '@hookform/resolvers/zod';
import { merge } from 'lodash-es';
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DataTable } from './components/data-table';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';
import useProductActionSetting from './hooks/product-action-setting';
import { useAdminCollectionPost } from './hooks/use-collection-post';

function paramsToObjState(searchParams: ReadonlyURLSearchParams) {
  try {
    const params = searchParams.get('search') ?? '';
    return JSON.parse(params);
  } catch (error) {
    return null;
  }
}

export default function TaskDataTable() {
  const { handleGetProductActionSettings } = useProductActionSetting();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ProductQuery>({
    resolver: zodResolver(productQuerySchema),
    defaultValues: merge(productQueryFromDefaultValues, paramsToObjState(searchParams)),
  });

  const formValue = form.watch();

  useEffect(() => {
    handleGetProductActionSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useAdminCollectionPost()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const query = createQueryString('search', JSON.stringify(formValue));
    router.push(pathname + '?' + query);
  }, [formValue, pathname, createQueryString, router]);  

  return (
    <div className="h-full flex-1 flex-col space-y-8 flex">
      <FormProvider {...form}>
        <ModalPostDetail />
        <DataTable />
      </FormProvider>
    </div>
  );
}
