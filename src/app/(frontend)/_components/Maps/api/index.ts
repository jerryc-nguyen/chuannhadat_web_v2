import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IResponseData } from '@common/types';
import { removeEmpty } from '@common/utils';
import { Marker } from '@maps/types';

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

export async function userPostsApi(authorSlug: string, params = {}): Promise<any> {
  return axiosInstance.get(API_ROUTES.MAPS.USER_POSTS.replace('{author_slug}', authorSlug), {
    params: removeEmpty(params),
  });
}

export interface RelatedLocation {
  total_posts: number;
  ward_name: string;
  featured_image_url: string;
  marker: Marker;
}


export interface RelatedLocationsResponse {
  district_name: string;
  wards: Array<RelatedLocation>;
}

export async function getRelatedLocations(markerUid: string): Promise<IResponseData<RelatedLocationsResponse>> {
  return axiosInstance.get(
    API_ROUTES.MAPS.RELATED_LOCATIONS.replace('{marker_uid}', markerUid)
  );
}
