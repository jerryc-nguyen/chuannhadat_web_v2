import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { concatStrings } from '@common/utils';
import { Author } from '@common/types/product';

export const profilesApi = {
  getProfileSlug: async (slug: string): Promise<{ data: Author }> => {
    return axiosInstance.get(concatStrings(API_ROUTES.PROFILES.GET_MY_PROFILE_SLUG, slug), {
      params: {
        slug,
      },
    });
  },

  getProfileId: async (id: number): Promise<any> => {
    return axiosInstance.get(`${API_ROUTES.PROFILES.GET_PROFILE_ID}/${id}`);
  },
};
