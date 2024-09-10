import { useMutation } from '@tanstack/react-query';
import axiosInstance from './axiosInstance';

import {
  IFormPropsLogin,
  IFormPropsRegister,
  IFormResponse,
  ILoginResponse,
  IRegisterResponse,
} from '@mobile/auth/types';

import { toast } from 'react-toastify';
import { API_ROUTES } from '@common/router';
import useAuth from '@mobile/auth/hooks/useAuth';

export function useLogin() {
  const { handleLogin } = useAuth();
  const { mutate: login, isPending: isLogin } = useMutation({
    // @ts-ignore: @TODO
    mutationFn: async (data: IFormPropsLogin) => {
      return await axiosInstance.post(API_ROUTES.AUTH.LOGIN_BY_PHONE, data);
    },
    onSuccess: (response: IFormResponse<ILoginResponse>) => {
      if (response.code === 200) {
        handleLogin(response.data);
      }
    },
    onError: () => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
    },
  });

  return { login, isLogin: isLogin };
}

export function useRegister() {
  const { mutate: register, isPending: isRegister } = useMutation({
    mutationFn: async (data: Partial<IFormPropsRegister>) =>
      await axiosInstance.post(API_ROUTES.AUTH.REGISTER_BY_PHONE, data),
    onSuccess: ({ data }: { data: IFormResponse<IRegisterResponse> }) => {
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
