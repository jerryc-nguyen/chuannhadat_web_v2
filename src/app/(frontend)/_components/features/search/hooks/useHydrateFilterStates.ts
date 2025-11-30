"use client";
import { useHydrateAtoms } from 'jotai/utils';
import { filterStateAtom } from '@frontend/features/search/filters-v2/states';
import { MCNCityAtom, MCNDistrictAtom, MCNWardAtom, MCNContentTypeAtom } from '@frontend/features/navigation/main-content-navigator/states';

export type HydrateInput = {
  filterState?: Record<string, any>;
  currentContentType?: string;
};

export function useHydrateFilterStates({ filterState, currentContentType }: HydrateInput) {
  const tuples = filterState
    ? (
        [
          [filterStateAtom, filterState || {}],
          [MCNCityAtom, filterState?.city],
          [MCNDistrictAtom, filterState?.district],
          [MCNWardAtom, filterState?.ward],
          [MCNContentTypeAtom, currentContentType],
        ] as const
      )
    : ([] as const);
  // Always call hook, with either no-op or actual hydration
  useHydrateAtoms(tuples as unknown as any);
}