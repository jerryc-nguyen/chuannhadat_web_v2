import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';
import {
  IFormPropsLogin,
  IFormResponse,
  ILoginResponse,
} from 'src/common/inteface';
import { API_ROUTES } from '@commons/constants/router';
import { AxiosError } from 'axios';
import { setCookie } from '@utils/cookies';
import { TOKEN } from '@commons/constants/common';

export function useLogin() {
  const { mutate: login, isPending: isLogin } = useMutation({
    mutationFn: async (data: IFormPropsLogin) =>
      await axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_PHONE, data),
    onSuccess: ({
      data,
    }: {
      data: IFormResponse<ILoginResponse>;
    }) => {
      if (data.code === 200) {
        setCookie(TOKEN, data.data.api_token);
      }
    },
    onError: (err: AxiosError<any>) => {
      console.log('In ra loi', err);
    },
  });

  return { login, isLogin: isLogin };
}
