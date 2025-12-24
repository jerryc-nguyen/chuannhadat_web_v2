import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const autocompleteApi = {
  projects: async (params: Record<string, A>): Promise<any> => {
    return axiosInstance.get(API_ROUTES.AUTOCOMPLETES.PROJECTS, { params });
  },
  deleteRecent: async (id: number): Promise<any> => {
    return axiosInstance.delete(API_ROUTES.AUTOCOMPLETES.DELETE_RECENT_PROJECT, { params: { project_id: id } });
  },
};
