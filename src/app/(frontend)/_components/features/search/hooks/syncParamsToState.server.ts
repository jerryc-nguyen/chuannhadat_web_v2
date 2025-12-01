// Server-only utility to derive initial filter state from URL and scope
import { IResponseData } from '@common/types';
import { toParamsApi } from '@frontend/features/search/api/searchApi';

export type SyncParamsInput = {
  pathWithQuery: string;
  scope: string;
};

export type ToParamsResponse = {
  params?: Record<string, A>;
  state?: Record<string, A>;
  parsed_path?: string;
} | null;

export type InitialFilterState = Record<string, A>;

export type InitialFilterResult = {
  filterState: InitialFilterState;
  parsedPath: string;
};


export async function getInitialFilterStateFromUrl({ pathWithQuery, scope }: SyncParamsInput): Promise<InitialFilterResult> {
  const params = { path: pathWithQuery, scope };
  const res = (await toParamsApi(params)) as IResponseData<ToParamsResponse>;
  const filterState: InitialFilterState = res?.data?.state || {};
  const parsedPath: string = res?.data?.parsed_path || '';
  return { filterState, parsedPath };
}
