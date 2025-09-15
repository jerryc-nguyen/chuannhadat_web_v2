import { IConnectOauthsPayload } from '@dashboard/AccountDetail/types';
import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { IFormPropsLogin, IFormPropsRegister, IRegisterResponse, LoginResponse } from '@frontend/features/auth/mobile/types';
import { HttpStatusCode } from 'axios';
import { IVerifyPhoneResponse } from '@frontend/auths/types';

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

  updateNewPassword: async (data: { security_token: string; password: string; password_confirmation: string }): Promise<{ status: boolean; message: string }> => {
    return axiosInstance.post(API_ROUTES.AUTH.UPDATE_NEW_PASSWORD, data);
  },

  resetPasswordByEmail: async (public_token: string): Promise<{ status: boolean; message: string }> => {
    return axiosInstance.post('/api/v1/authentications/forgot_password', { public_token });
  },
};
