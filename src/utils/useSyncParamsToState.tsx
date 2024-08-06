'use client';

import { toParamsApi } from '@api/searchApi';
import { usePathname } from 'next/navigation';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useHydrateAtoms } from 'jotai/utils';

import {
  queryOptions,
  useSuspenseQuery,
} from '@tanstack/react-query';

function useSyncParamsToState() {
  const currentPage = usePathname();
  const params = { path: currentPage };

  console.log('currentPage', currentPage);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['toParamsApi', params],
      queryFn: async () => {
        const response = await toParamsApi(params);

        return response.json();
      },
    })
  );

  useHydrateAtoms([[filterStateAtom, data.data?.state || {}]]);
}

export { useSyncParamsToState };
