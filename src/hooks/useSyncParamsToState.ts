'use client';

import { toParamsApi } from '@api/searchApi';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useHydrateAtoms } from 'jotai/utils';

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

function useSyncParamsToState() {
  const currentPage = usePathname();
  const queryParams = useSearchParams() as ReadonlyURLSearchParams;

  const params = {
    path: currentPage + '?' + queryParams.toString(),
  };

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['toParamsApi', params],
      queryFn: () => toParamsApi(params),
    }),
  );

  useHydrateAtoms([[filterStateAtom, data.data?.state || {}]]);
}

export { useSyncParamsToState };
