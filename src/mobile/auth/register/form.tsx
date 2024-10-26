'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IFormPropsRegister, IRegisterResponse } from '../types';
import registerSchema from './resolver';
import { Button } from '@components/ui/button';
import { services } from '@api/services';
import { toast } from 'react-toastify';
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
import useAuth from '../hooks/useAuth';
import { setTokenServer } from '@app/action';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';
type RegisterFormProps = {
  onClose: () => void;
};
export default function RegisterForm({ onClose }: RegisterFormProps) {
  const { handleLogin } = useAuth();
  const { loadMore } = usePaginatedNotifications();
  const { mutate: registerMutate, isPending: isRegister } = useMutation({
    mutationFn: services.auth.signUp,
    onSuccess: (response: IRegisterResponse) => {
      if (response.code === 200 && response.status) {
        const userData = response.data;
        handleLogin(userData);
        loadMore();
        const handleSetToken = setTokenServer.bind(null, userData.api_token);
        handleSetToken();
        toast.success('Đăng ký thàng công');
      } else {
        toast.error(response.message ?? 'Lỗi đăng ký');
        reset();
      }
      onClose();
    },
    onError: (error) => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
      console.debug(error);
      reset();
    },
  });
  const form = useForm({
    resolver: yupResolver(registerSchema),
  });
  const { control, handleSubmit, reset } = form;
  const onSubmit = (data: IFormPropsRegister) => {
    registerMutate({
      phone: data.phone,
      password: data.password,
    });
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
                Số điện thoại/ Email
              </FormLabel>
              <FormControl className="relative">
                <Input
                  {...field}
                  id="phone"
                  type="text"
                  className={`mt-1 block w-full rounded-md border py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
                  placeholder="Nhập số điện thoại/ Email"
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
          className="text-md my-4 w-full rounded-md bg-primary_color/80 px-4 py-2 font-semibold text-white hover:bg-primary_color focus:animate-pulse"
        >
          {isRegister ? 'Đang xác thực' : 'Đăng ký'}
        </Button>
      </form>
    </Form>
  );
}
