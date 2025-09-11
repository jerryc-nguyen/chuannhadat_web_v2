import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const autocompleteApi = {
  projects: async (params: { keyword: string; limit: number }): Promise<any> => {
    return axiosInstance.get(API_ROUTES.AUTOCOMPLETES.PROJECTS, { params });
  },
};
