import { toParamsApi } from '@frontend/features/search/api/searchApi';
import { searchParamsToObj } from '@common/utils';
import { SearchScopeEnums } from '@frontend/features/search/hooks/useSearchScope';
import useFilterState from '@frontend/features/search/filter-conditions/hooks/useFilterState';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ProductApiService from '../apis/product-api';
import { CollectionPost } from '../constant/use-query-key';
import { ProductQuery } from '../data/schemas/product-query-schema';

export const useAdminCollectionPost = () => {
  const searchParams = useSearchParams();
  const { setFilterState } = useFilterState();
  const reqParams = {
    path: searchParams?.get('filter_chips') || '--',
    scope: SearchScopeEnums.ManagePosts,
  };

  const response = useQuery({
    queryKey: ['toParamsApi', searchParams, reqParams],
    queryFn: () => toParamsApi(reqParams)
  });

  useEffect(() => {
    if (response?.data?.data?.state) {
      setFilterState(response?.data?.data?.state);
    }
  }, [response?.data?.data?.state]);

  return useQuery({
    queryKey: [CollectionPost, searchParamsToObj(searchParams)],
    queryFn: () => ProductApiService.Filter(searchParamsToObj(searchParams) as ProductQuery) as A, // TODO: fix type A
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
};