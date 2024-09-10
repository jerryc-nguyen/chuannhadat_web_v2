import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';

export const services = {
  getMyProfile: async (headers?: A): Promise<A> => {
    return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE, { headers: headers });
  },
};
