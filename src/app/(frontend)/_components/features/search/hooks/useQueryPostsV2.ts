import { useMemo } from 'react';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';

interface FilterParams {
  [key: string]: any;
  per_page?: number;
  page?: number;
}

function useQueryPostsV2(filterParams: FilterParams) {
  console.log('🔍 useQueryPostsV2 - Called with filterParams:', filterParams);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['useQueryPostsV2', filterParams],
      queryFn: () => {
        console.log('🔍 useQueryPostsV2 - Executing searchApiV2 with:', filterParams);
        return searchApiV2(filterParams);
      },
      staleTime: 0, // Force immediate refetch when parameters change
      gcTime: 0, // Don't cache the results
    }),
  );

  const products = useMemo(() => {
    console.log('🔍 useQueryPostsV2 - Products memoized:', data.data?.length, data.data);
    return data.data;
  }, [data.data])

  return { products, data, aggreations: data.aggs };
}

export default useQueryPostsV2;
