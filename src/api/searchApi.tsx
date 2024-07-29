import { apiFetch, baseUrl } from './base';
import { removeEmpty } from '@utils/hash';
import queryString from 'query-string';

async function searchs(params = {}): Promise<any> {
  const path = `${baseUrl}/api/v1/searchs?${queryString.stringify(
    removeEmpty(params)
  )}`;

  return apiFetch(path, {
    method: 'GET',
  });
}

const postApis = { searchs };

export default postApis;
