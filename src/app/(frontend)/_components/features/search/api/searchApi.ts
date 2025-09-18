import { removeEmpty } from '@common/utils';
import axiosInstance from '@common/api/axiosInstance';

export async function searchApi(params = {}): Promise<A> {
  return axiosInstance.get('/api/v1/searchs', {
    params: removeEmpty(params),
  });
}

export async function toParamsApi(params = {}): Promise<A> {
  return axiosInstance.get('/api/v1/searchs/to_params', {
    params: removeEmpty(params),
  });
}

export async function cardAuthors(params = {}): Promise<A> {
  return axiosInstance.get('/api/v1/searchs/card_authors', {
    params: removeEmpty(params),
  });
}
