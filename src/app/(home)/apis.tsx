import { queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';

export const homeApiOptions = queryOptions({
  queryKey: ['home'],
  queryFn: (params: A) => searchApi(params),
});
