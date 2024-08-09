import { apiFetch, apiBaseUrl } from './base';

import { removeEmpty } from '@utils/hash';
import queryString from 'query-string';

export async function searchApi(params = {}): Promise<any> {
  const path = `${apiBaseUrl}/api/v1/searchs?${queryString.stringify(
    removeEmpty(params)
  )}`;
  return apiFetch(path, {
    method: 'GET',
  });
}

export async function toParamsApi(params = {}): Promise<any> {
  const path = `${apiBaseUrl}/api/v1/searchs/to_params?${queryString.stringify(
    removeEmpty(params)
  )}`;
  return apiFetch(path, {
    method: 'GET',
  });
}
