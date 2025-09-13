import { searchParamsToObj } from '@common/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadcrumb, useSyncQueryToUrl } from '@common/hooks';
import { merge } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ProductQuery, productQuerySchema } from '../data/schemas/product-query-schema';
import { productQueryFromDefaultValues } from '../data/type/product-query';
import { DASHBOARD_ROUTES } from '@common/router';

export const useListPostsForm = () => {
  // Setup breadcrumbs
  useBreadcrumb([
    {
      link: DASHBOARD_ROUTES.posts.index,
      title: 'Danh sách tin đăng',
      isActive: true,
    },
  ]);

  // Get search params
  const searchParams = useSearchParams();

  // Setup form
  const searchForm = useForm<ProductQuery>({
    resolver: zodResolver(productQuerySchema),
    defaultValues: merge(productQueryFromDefaultValues, searchParamsToObj(searchParams) as any),
  });

  // Watch form values and sync to URL
  const formValue = searchForm.watch();
  useSyncQueryToUrl(formValue);

  return {
    searchForm,
    formValue,
  };
};
