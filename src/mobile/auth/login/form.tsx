'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from './resolver';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { IFormPropsLogin, LoginResponse } from '../types';
import { usePaginatedNotifications } from '@mobile/notification/hooks';
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
import { BsQrCode } from 'react-icons/bs';
import { IoLogoFacebook } from 'react-icons/io5';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { services } from '@api/services';
import { setTokenServer } from '@app/action';

type LoginFormProps = {
  onClose: () => void;
};
const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const { handleLogin } = useAuth();
  const { loadMore } = usePaginatedNotifications();

  const { mutate: signInMutate, isPending } = useMutation({
    mutationFn: services.auth.signIn,
    onSuccess: (response: LoginResponse) => {
      if (response.status) {
        const userData = response.data;
        handleLogin(userData);
        const handleSetToken = setTokenServer.bind(null, userData.api_token);
        handleSetToken();
        loadMore();
        onClose();
        toast.success(
          `Xin chào, ${userData.full_name || userData.phone} bạn đã đăng nhập thành công!`,
        );
      } else {
        toast.error('Mật khẩu hoặc tài khoản không chính xác');
      }
      reset();
    },
    onError: (error) => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
      console.debug(error);
      reset();
    },
  });

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      password: '',
      phone: '',
    },
  });
  const { control, handleSubmit, reset } = form;

  const onSubmit = (data: IFormPropsLogin) => {
    signInMutate({
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
          <Link href="/" className="text-sm font-semibold text-blue-400 hover:underline">
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

        <div className="text-center">
          <span className="pr-1 text-sm"> Bạn chưa có tài khoản?</span>
          <Link href="/register" className="text-sm font-semibold text-blue-400 hover:underline">
            Đăng ký
          </Link>
        </div>

        <div className="mt-4 flex w-full items-center justify-between gap-x-2">
          <span className="block h-[1px] flex-1 bg-slate-300" />
          <span className="px-2 text-center text-sm text-gray-500">Hoặc </span>
          <span className="block h-[1px] flex-1 bg-slate-300" />
        </div>
        <div className="mb-4 flex items-center justify-center gap-x-3 text-sm">
          <div className="flex flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 py-3 shadow-lg">
            <FcGoogle className="text-2xl sm:text-xl" />
            <span className="hidden sm:block">Google</span>
          </div>
          <div className="flex flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 py-3 shadow-lg">
            <IoLogoFacebook className="text-2xl text-blue-500 sm:text-xl" />
            <span className="hidden sm:block">Facebook</span>
          </div>
          <div className="flex h-full flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-md border border-primary_color/30 py-3 shadow-lg">
            <BsQrCode className="h-6 w-6 text-primary_color sm:h-4 sm:w-4" />
            <span className="hidden sm:block"> QR</span>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
