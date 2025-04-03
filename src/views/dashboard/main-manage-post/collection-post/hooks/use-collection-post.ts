import { searchParamsToObj } from '@common/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import ProductApiService from '../apis/product-api';
import { CollectionPost } from '../constant/use-query-key';
import { ProductQuery } from '../data/schemas';
import { toParamsApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { SearchScopeEnums } from '@hooks/useSearchScope';

export const useAdminCollectionPost = () => {
  const searchParams = useSearchParams();
  const { setFilterState } = useFilterState();
  const reqParams = {
    path: searchParams?.get('filter_chips') || '--',
    scope: SearchScopeEnums.ManagePosts
  }

  const response = useQuery({
    queryKey: ['toParamsApi', searchParams, reqParams],
    queryFn: () => toParamsApi(reqParams),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })

  if (response?.data?.data?.state) {
    setFilterState(response?.data?.data?.state)
  }

  return useQuery({
    queryKey: [CollectionPost, searchParamsToObj(searchParams)],
    queryFn: () => ProductApiService.Filter(searchParamsToObj(searchParams) as ProductQuery) as A, // TODO: fix type A
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
};
