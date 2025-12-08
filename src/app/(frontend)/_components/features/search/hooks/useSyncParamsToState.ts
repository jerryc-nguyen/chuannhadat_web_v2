'use client';

import { toParamsApi } from '@frontend/features/search/api/searchApi';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { filterStateAtom } from '@frontend/features/search/filters-v2/states';
import { useHydrateAtoms } from 'jotai/utils';

import { useQuery } from '@tanstack/react-query';
import useSearchScope from './useSearchScope';
import { MCNCityAtom, MCNContentTypeAtom, MCNDistrictAtom, MCNWardAtom } from '@frontend/features/navigation/main-content-navigator/states';

function useSyncParamsToState(initialFilterState?: Record<string, any>) {
  const currentPage = usePathname();
  const queryParams = useSearchParams() as ReadonlyURLSearchParams;
  const { searchScope, currentContentType } = useSearchScope();

  const params = {
    path: currentPage + '?' + queryParams.toString(),
    scope: searchScope
  };

  const { data } = useQuery({
    queryKey: ['toParamsApi', params],
    queryFn: () => toParamsApi(params),
    // If server provided initial filter state, stop client fetch
    enabled: !initialFilterState,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const filterState = initialFilterState ?? data?.data?.state ?? {};

  useHydrateAtoms([
    [filterStateAtom, filterState],
    [MCNCityAtom, filterState?.city],
    [MCNDistrictAtom, filterState?.district],
    [MCNWardAtom, filterState?.ward],
    [MCNContentTypeAtom, currentContentType]
  ]);

  return {
    filterState,
  }
}

export { useSyncParamsToState };
