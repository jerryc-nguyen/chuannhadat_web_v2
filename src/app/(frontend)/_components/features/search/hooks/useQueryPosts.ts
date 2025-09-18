import { useMemo } from 'react';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@frontend/features/search/api/searchApi';

interface FilterParams {
  [key: string]: any;
  per_page?: number;
  page?: number;
}

function useQueryPosts(filterParams: FilterParams) {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['useQueryPosts', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  const products = useMemo(() => { return data.data }, [data.data])

  return { products, data, aggreations: data.aggs };
}

export default useQueryPosts;
