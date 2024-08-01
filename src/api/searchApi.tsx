import { apiFetch, baseUrl } from './base';
import { removeEmpty } from '@utils/hash';
import queryString from 'query-string';

export async function searchApi(params = {}): Promise<any> {
  const path = `${baseUrl}/api/v1/searchs?${queryString.stringify(
    removeEmpty(params)
  )}`;
  console.log('calling api');
  return apiFetch(path, {
    method: 'GET',
  });
}
