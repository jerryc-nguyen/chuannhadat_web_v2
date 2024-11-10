'use client';

import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import { zodResolver } from '@hookform/resolvers/zod';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { merge } from 'lodash-es';
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ProductApiService from './apis/product-api';
import { DataTable } from './components/data-table';
import { CollectionPost } from './constant/use-query-key';
import { ProductQuery, productQuerySchema } from './data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from './data/type/product-query';
import useProductActionSetting from './hooks/product-action-setting';

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

  const { data, isLoading } = useQuery({
    queryKey: [CollectionPost, paramsToObjState(searchParams)],
    queryFn: () => ProductApiService.Filter(paramsToObjState(searchParams)),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });

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
    <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
      <FormProvider {...form}>
        <ModalPostDetail />
        <DataTable />
      </FormProvider>
    </div>
  );
}
