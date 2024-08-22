import { queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';

export const homeApiOptions = queryOptions({
  queryKey: ['home'],
  queryFn: async (params: A) => {
    const response = await searchApi(params);

    // return response.json();
    return response;
  },
});
