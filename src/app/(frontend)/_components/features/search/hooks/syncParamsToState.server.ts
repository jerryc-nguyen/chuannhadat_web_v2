// Server-only utility to derive initial filter state from URL and scope
import { toParamsApi } from '@frontend/features/search/api/searchApi';

export type SyncParamsInput = {
  pathWithQuery: string;
  scope: string;
};

export type InitialFilterState = Record<string, any>;

export async function getInitialFilterStateFromUrl({ pathWithQuery, scope }: SyncParamsInput) {
  const params = { path: pathWithQuery, scope };
  const res = await toParamsApi(params);
  const filterState: InitialFilterState = res?.data?.data?.state || res?.data?.state || {};
  return filterState;
}