import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IProfileMeResponse, IResponseData } from '@common/types/api';

export const profileApi = {
  getMyProfile: async (): Promise<IProfileMeResponse> => {
    return axiosInstance.get(API_ROUTES.PROFILES.GET_MY_PROFILE);
  },

  updateEmail: async (email: string): Promise<any> => {
    return axiosInstance.post(`${API_ROUTES.PROFILES.UPDATE_EMAIL}`, {
      email: email,
    });
  },

  confirmEmail: async (confirm_email_token: string): Promise<any> => {
    return axiosInstance.post(`${API_ROUTES.PROFILES.CONFIRM_EMAIL}`, {
      confirm_email_token: confirm_email_token,
    });
  },

  updateMyPhone: async (data: { phone: string }) => {
    return axiosInstance.post(API_ROUTES.PROFILES.UPDATE_PHONE, data);
  },

  checkDeposit: async (last_credit_id: number): Promise<IResponseData<any>> => {
    return axiosInstance.post(API_ROUTES.PROFILES.CHECK_DEPOSIT, {
      last_credit_id: last_credit_id || undefined,
    });
  },
};
