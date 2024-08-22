import { removeEmpty } from '@common/utils';
import { privateAxios } from './base';

export async function searchApi(params = {}): Promise<A> {
  return privateAxios.get('/api/v1/searchs', {
    params: removeEmpty(params),
  });
}

export async function toParamsApi(params = {}): Promise<A> {
  return privateAxios.get('/api/v1/searchs/to_params', {
    params: removeEmpty(params),
  });
}
