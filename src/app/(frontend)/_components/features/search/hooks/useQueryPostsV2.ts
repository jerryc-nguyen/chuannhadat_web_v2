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
      queryFn: () => searchApiV2(filterParams),
    }),
  );

  const products = useMemo(() => { return data.data }, [data.data])

  return { products, data, aggreations: data.aggs };
}

export default useQueryPostsV2;
