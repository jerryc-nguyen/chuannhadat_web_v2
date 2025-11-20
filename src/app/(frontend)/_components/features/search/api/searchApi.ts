import { removeEmpty } from '@common/utils';
import axiosInstance from '@common/api/axiosInstance';

export async function searchApi(params = {}): Promise<A> {
  return axiosInstance.get('/api/v1/searchs', {
    params: removeEmpty(params),
  });
}

export async function buildSeoListingUrl(params = {}): Promise<A> {
  return axiosInstance.get('/api/v1/seos/listing_url', {
    params: removeEmpty(params),
  });
}

export async function searchApiV2(params = {}): Promise<A> {
  return axiosInstance.get('/api/v2/searchs', {
    params: removeEmpty(params),
  });
}

export async function countSearchResultsApiV2(params = {}): Promise<A> {
  try {
    const res = await axiosInstance.get('/api/v2/searchs', {
      params: removeEmpty(params),
    });
    const payload = res as Record<string, any>;
    const total = payload?.pagination?.total_count ?? 0;
    return Number.isFinite(total) ? total : 0;
  } catch (error) {
    console.log('countSearchResultsApiV2 error', error);
    return 0;
  }
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
