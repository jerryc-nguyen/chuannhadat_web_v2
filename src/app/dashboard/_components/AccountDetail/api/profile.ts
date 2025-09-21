import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IResponseData, IUser } from '@common/types';
import { IModalUpdatePassoword, IModalUpdateProfile } from '../types';

export const profileApi = {
  getMyProfile: async (): Promise<IResponseData<IUser>> => {
    return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE);
  },

  updateMyProfile: async (data: IModalUpdateProfile): Promise<IResponseData<IUser>> => {
    return axiosInstance.put(API_ROUTES.PROFILES.UPDATE_MY_PROFILE, data);
  },

  updateMyAvatar: async (data: FormData): Promise<IResponseData<{ avatar_url: string }>> => {
    return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_AVATAR, data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  },

  updateMyPassword: async (data: IModalUpdatePassoword): Promise<IResponseData<{ success: boolean }>> => {
    return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PASSWORD, data);
  },

  updateEmail: async (email: string): Promise<IResponseData<{ success: boolean }>> => {
    return axiosInstance.post(`${API_ROUTES.PROFILES.UPDATE_EMAIL}`, {
      email: email,
    });
  },

  confirmEmail: async (confirm_email_token: string): Promise<IResponseData<{ success: boolean }>> => {
    return axiosInstance.post(`${API_ROUTES.PROFILES.CONFIRM_EMAIL}`, {
      confirm_email_token: confirm_email_token,
    });
  },

  updateMyPhone: async (data: { phone: string }): Promise<IResponseData<{ success: boolean }>> => {
    return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PHONE, data);
  },
};
