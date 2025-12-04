'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { IFormPropsRegister, IRegisterResponse } from '../types';
import registerSchema from './resolver';
import { Button } from '@components/ui/button';
import { authApi } from '@frontend/auths/api';
import { useMutation } from '@tanstack/react-query';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCookie, removeCookie } from '@common/cookies';
import { REFERRAL_CODE } from '@common/auth';
import { toast } from 'sonner';
import { useAuth } from '@common/auth/AuthContext';

type RegisterFormProps = {
  onClose?: () => void;
  setActiveTab?: (tab: string) => void;
};
export default function RegisterForm({ onClose, setActiveTab }: RegisterFormProps) {
  const { handleSignIn } = useAuth();
  const router = useRouter();
  const { mutate: registerMutate, isPending: isRegister } = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (response: IRegisterResponse) => {
      if (response.code === 200 && response.status) {
        const userData = response.data;
        handleSignIn(userData);
        toast.success('Đăng ký tài khoản thàng công');
        onClose && onClose();
      } else {
        toast.error(response.message ?? 'Lỗi đăng ký');
      }
      removeCookie(REFERRAL_CODE);
    },
    onError: () => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
    },
  });
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: '',
      phone: '',
      confirmPassword: '',
    },
  });
  const { control, handleSubmit } = form;
  const onSubmit = (data: IFormPropsRegister) => {
    registerMutate({
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      referral_code: getCookie(REFERRAL_CODE),
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <form className="mt-4 flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required htmlFor="phone" className="mb-2 block text-sm font-medium">
                Số điện thoại
              </FormLabel>
              <FormControl className="relative">
                <Input
                  {...field}
                  id="phone"
                  type="text"
                  className={`mt-1 block w-full rounded-md border py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập số điện thoại"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                aria-required
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Mật khẩu
              </FormLabel>
              <FormControl className="relative">
                <Input
                  {...field}
                  type="password"
                  id="password"
                  className={`mt-1 block w-full rounded-md border py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập mật khẩu"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel
                aria-required
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Nhập lại mật khẩu
              </FormLabel>
              <FormControl className="relative">
                <Input
                  {...field}
                  type="password"
                  id="confirmPassword"
                  className={`mt-1 block w-full rounded-md border py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập lại mật khẩu"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isRegister}
          type="submit"
          className="text-md mt-4 w-full rounded-md bg-primary_color/80 px-4 py-2 font-semibold text-white hover:bg-primary_color focus:animate-pulse"
        >
          {isRegister ? 'Đang xác thực' : 'Đăng ký'}
        </Button>
        <div className="text-center">
          <span className="pr-1 text-sm"> Bạn đã có tài khoản?</span>

          <a
            onClick={() => {
              setActiveTab && setActiveTab('login');
            }}
            className="text-sm font-semibold text-blue-400 hover:underline"
          >
            Đăng nhập
          </a>
        </div>
      </form>
    </Form>
  );
}
