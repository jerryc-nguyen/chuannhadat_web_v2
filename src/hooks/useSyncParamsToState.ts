'use client';

import { toParamsApi } from '@api/searchApi';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useHydrateAtoms } from 'jotai/utils';

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import useSearchScope from './useSearchScope';
import { MCNCityAtom, MCNContentTypeAtom, MCNDistrictAtom, MCNWardAtom } from '@components/main-content-navigator/states';

function useSyncParamsToState() {
  const currentPage = usePathname();
  const queryParams = useSearchParams() as ReadonlyURLSearchParams;
  const { searchScope, currentContentType } = useSearchScope();

  const params = {
    path: currentPage + '?' + queryParams.toString(),
    scope: searchScope
  };

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['toParamsApi', params],
      queryFn: () => toParamsApi(params),
    }),
  );

  const filterState = data.data?.state || {};

  useHydrateAtoms([
    [filterStateAtom, filterState],
    [MCNCityAtom, filterState?.city],
    [MCNDistrictAtom, filterState?.district],
    [MCNWardAtom, filterState?.ward],
    [MCNContentTypeAtom, currentContentType]
  ]);
}

export { useSyncParamsToState };
