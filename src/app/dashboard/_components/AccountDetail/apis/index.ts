import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IModalUpdatePassoword, IModalUpdateProfile } from '../types';

export const service = {
  profiles: {
    getMyProfile: async (headers?: A): Promise<A> => {
      return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE, { headers: headers });
    },
    updateMyProfile: async (data: IModalUpdateProfile): Promise<A> => {
      return axiosInstance.put(API_ROUTES.PROFILES.UPDATE_MY_PROFILE, data);
    },
    updateMyAvatar: async (data: FormData) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_AVATAR, data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });
    },
    updateMyPassword: async (data: IModalUpdatePassoword) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PASSWORD, data);
    },
    updateMyPhone: async (data: { phone: string }) => {
      return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PHONE, data);
    },
  },
};
