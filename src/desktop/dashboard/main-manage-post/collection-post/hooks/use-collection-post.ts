import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import ProductApiService from '../apis/product-api';
import { CollectionPost } from '../constant/use-query-key';

function paramsToObjState(searchParams: ReadonlyURLSearchParams) {
  try {
    const params = searchParams.get('search') ?? '';
    return JSON.parse(params);
  } catch (error) {
    return null;
  }
}

export const useAdminCollectionPost = () => {
  const searchParams = useSearchParams();

  return useQuery({
    queryKey: [CollectionPost, paramsToObjState(searchParams)],
    queryFn: () => ProductApiService.Filter(paramsToObjState(searchParams)) as A, // TODO: fix type A
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
};
