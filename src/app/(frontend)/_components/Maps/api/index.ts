import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { removeEmpty } from '@common/utils';

export const mapsApi = {
  markers: async (params: { keyword: string; limit: number }): Promise<any> => {
    return axiosInstance.get(API_ROUTES.MAPS.MARKERS, { params });
  },
  markersByBounds: async (params: {
    north: number;
    south: number;
    east: number;
    west: number;
    page?: number;
    per_page?: number;
  }, opts?: { signal?: AbortSignal }): Promise<any> => {
    return axiosInstance.get(API_ROUTES.MAPS.MARKERS, { params, signal: opts?.signal });
  },
};

export async function userPostsApi(params = {}): Promise<A> {
  return axiosInstance.get(API_ROUTES.MAPS.USER_POSTS, {
    params: removeEmpty(params),
  });
}
