'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from './resolver';
import Link from 'next/link';
import { IFormPropsLogin, LoginResponse } from '../types';
import { Input } from '@components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Button } from '@components/ui/button';
import { useAuth } from '@common/auth/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { services } from '@api/services';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import React from 'react';
import LoginSocial from '@components/login-social';

type LoginFormProps = {
  onClose?: () => void;
};
const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const { login } = useAuth();
  const router = useRouter();
  const { mutate: signInMutate, isPending } = useMutation({
    mutationFn: services.auth.signIn,
    onSuccess: (response: LoginResponse) => {
      if (response.status) {
        const userData = response.data;

        // Use the new AuthContext login method with the correct token field
        // The API uses api_token as the auth token
        login(
          userData.api_token,
          userData
        );

        onClose && onClose();
        toast.success(
          `Xin chào, ${userData.full_name || userData.phone} bạn đã đăng nhập thành công!`,
        );

        // Check if we need to redirect after login
        try {
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            router.push(redirectPath);
          } else {
            // Default redirect after login (e.g., dashboard)
            router.push('/dashboard');
          }
        } catch (e) {
          console.error('Error handling redirect:', e);
        }
      } else {
        toast.error('Tài khoản hoặc mật khẩu không chính xác');
      }
    },
    onError: (error) => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
      console.debug(error);
    },
  });

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      password: '',
      phone: '',
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit = (data: IFormPropsLogin) => {
    signInMutate({
      phone: data.phone,
      password: data.password,
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <LoginSocial handleSuccessLogin={onClose} />

      <div className="mt-4 flex w-full items-center justify-between gap-x-2">
        <span className="block h-[1px] flex-1 bg-slate-300" />
        <span className="px-2 text-center text-sm text-gray-500">Hoặc</span>
        <span className="block h-[1px] flex-1 bg-slate-300" />
      </div>

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
              <FormControl>
                <Input
                  {...field}
                  autoComplete="phone"
                  id="phone"
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
              <FormControl>
                <Input
                  autoComplete="password"
                  type="password"
                  {...field}
                  id="password"
                  placeholder="Nhập mật khẩu"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Link
            onClick={onClose}
            href="/forgot-password"
            className="text-sm font-semibold text-blue-400 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="text-md flex w-full items-center gap-x-2 rounded-md bg-primary_color/80 px-4 py-2 font-semibold text-white focus-within:animate-pulse hover:bg-primary_color"
        >
          {isPending ? 'Đang xác thực ...' : 'Đăng nhập'}
        </Button>

        {/* <div className="text-center">
          <span className="pr-1 text-sm"> Bạn chưa có tài khoản?</span>
          <Link href="/sign-up" className="text-sm font-semibold text-blue-400 hover:underline">
            Đăng ký
          </Link>
        </div> */}

      </form>
    </Form>
  );
};

export default LoginForm;
