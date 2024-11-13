import { searchParamsToObj } from '@common/utils';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import ProductApiService from '../apis/product-api';
import { CollectionPost } from '../constant/use-query-key';
import { ProductQuery } from '../data/schemas';

export const useAdminCollectionPost = () => {
  const searchParams = useSearchParams();

  return useQuery({
    queryKey: [CollectionPost, searchParamsToObj(searchParams)],
    queryFn: () => ProductApiService.Filter(searchParamsToObj(searchParams) as ProductQuery) as A, // TODO: fix type A
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
};
