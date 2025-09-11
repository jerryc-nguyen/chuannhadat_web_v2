import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IFormPropsLogin, IFormPropsRegister, IRegisterResponse, LoginResponse } from '@components/features/auth/mobile/types';
import { IConnectOauthsPayload } from '@common/models/modelPayload';
import { IVerifyPhoneResponse } from '@common/models/modelResponse';
import { HttpStatusCode } from 'axios';

export const authApi = {
  signIn: async (data: IFormPropsLogin): Promise<LoginResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_PHONE, data);
  },

  signUp: async (data: Partial<IFormPropsRegister>): Promise<IRegisterResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.REGISTER_BY_PHONE, data);
  },

  loginGoogle: async (data: IConnectOauthsPayload): Promise<LoginResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_GOOGLE, data);
  },

  verifyPhone: async (phone: string): Promise<IVerifyPhoneResponse> => {
    return axiosInstance.post(API_ROUTES.AUTH.VERIFY_PHONE, {
      phone: phone,
    });
  },

  checkResetPassword: async (phone: string): Promise<{ status: boolean; code: HttpStatusCode }> => {
    return axiosInstance.post(API_ROUTES.AUTH.CHECK_RESET_PASSWORD, {
      phone: phone,
    });
  },
};
