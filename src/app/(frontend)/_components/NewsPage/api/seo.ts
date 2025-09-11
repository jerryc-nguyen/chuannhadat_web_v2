import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const seoApi = {
  getSeoMetadata: async (path: string): Promise<any> => {
    return axiosInstance.get(API_ROUTES.SEOS, { params: { path } });
  },
};
