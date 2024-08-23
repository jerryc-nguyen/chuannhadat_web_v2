import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

import { setCookie } from '@common/cookies';
import {
  IFormPropsLogin,
  IFormPropsRegister,
  IFormResponse,
  ILoginResponse,
  IRegisterResponse,
} from '@mobile/auth/types';

import { toast } from 'react-toastify';
import { saveToStorage } from '@common/localstorage';
import { API_ROUTES } from '@common/router';
import { TOKEN, userLocalStorage } from '@common/constants';

export function useLogin() {
  const { mutate: login, isPending: isLogin } = useMutation(
    {
      mutationFn: async (data: IFormPropsLogin) =>
        await axiosInstance.post(
          API_ROUTES.AUTH.LOGIN_BY_PHONE,
          data,
        ),
      onSuccess: ({
        data,
      }: {
        data: IFormResponse<ILoginResponse>;
      }) => {
        if (data.code === 200) {
          setCookie(TOKEN, data.data.api_token);
          saveToStorage(
            userLocalStorage,
            JSON.stringify(data.data),
          );
        }
      },
      onError: () => {
        toast.error('Lỗi server vui lòng đăng nhập lại');
      },
    },
  );

  return { login, isLogin: isLogin };
}

export function useRegister() {
  const { mutate: register, isPending: isRegister } =
    useMutation({
      mutationFn: async (
        data: Partial<IFormPropsRegister>,
      ) =>
        await axiosInstance.post(
          API_ROUTES.AUTH.REGISTER_BY_PHONE,
          data,
        ),
      onSuccess: ({
        data,
      }: {
        data: IFormResponse<IRegisterResponse>;
      }) => {
        if (data.code === 200) {
          toast.success('Đăng ký thàng công');
        } else {
          toast.error(data.message ?? 'Lỗi đăng ký');
        }
      },
      onError: () => {
        toast.error('Lỗi server vui lòng đăng nhập lại');
      },
    });

  return { register, isRegister: isRegister };
}
