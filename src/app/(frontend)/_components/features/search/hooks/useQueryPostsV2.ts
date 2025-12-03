import { useMemo } from 'react';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';

interface FilterParams {
  [key: string]: any;
  per_page?: number;
  page?: number;
}

function useQueryPostsV2(filterParams: FilterParams) {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['useQueryPostsV2', filterParams],
      queryFn: () => {
        console.log('🔍 useQueryPostsV2 - Executing searchApiV2 with:', filterParams);
        return searchApiV2(filterParams);
      },
      // Use QueryClient defaults to leverage SSR hydration and avoid immediate refetch
    }),
  );

  const products = useMemo(() => {
    return data.data;
  }, [data.data])

  const totalCount = useMemo(() => {
    return data.pagination.total_count;
  }, [data.pagination.total_count]);

  return { products, data, aggreations: data.aggs, totalCount };
}

export default useQueryPostsV2;
