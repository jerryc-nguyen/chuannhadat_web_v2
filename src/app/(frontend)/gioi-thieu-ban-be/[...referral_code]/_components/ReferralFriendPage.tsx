'use client';
import { referralsApi } from '../api/referrals';
import { authApi } from '@common/api/auth';
import forgot_password from '@assets/icons/Refer a friend-bro.svg';
import { REFERRAL_CODE } from '@common/auth';
import { useAuth } from '@common/auth/AuthContext';
import { removeCookie, setCookie } from '@common/cookies';
import LoginSocial from '@components/login-social';
import Logo from '@components/logo';
import { Button } from '@components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import registerSchema from '@frontend/features/auth/mobile/register/resolver';
import { IRegisterResponse } from '@frontend/features/auth/mobile/types';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
type ReferralFriendPageProps = {
  referral_code: string;
};

const ReferralFriendPage: React.FC<ReferralFriendPageProps> = (props) => {
  const { referral_code } = props;
  const searchParams = useSearchParams();
  const { handleSignIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      password: '',
      phone: '',
      confirmPassword: '',
    },
  });
  const { control, handleSubmit, reset } = form;
  const { data } = useSuspenseQuery({
    queryKey: ['get-referral-detail', referral_code],
    queryFn: () => referralsApi.getReferralDetail(referral_code as string),
    select: (data) => data.data,
  });
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  React.useEffect(() => {
    setCookie(REFERRAL_CODE, referral_code);
    const redirectUrl = process.env.NEXT_PUBLIC_BASE_CHUANHADAT_DOMAIN;
    router.push(pathname + '?' + createQueryString('redirectUrl', redirectUrl as string));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { mutate: registerMutate, isPending: isRegister } = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (response: IRegisterResponse) => {
      if (response.code === 200 && response.status) {
        const userData = response.data;
        handleSignIn(userData);
        toast.success('Đăng ký tài khoản thàng công');
        const redirectUrl = searchParams?.get('redirectUrl');
        router.push(redirectUrl as string);
        reset();
      } else {
        toast.error(response.message ?? 'Đăng ký tài khoản bị lỗi');
      }
      removeCookie(REFERRAL_CODE);
    },
    onError: (error) => {
      toast.error('Lỗi server vui lòng đăng nhập lại');
      throw new Error(error.message);
      reset();
    },
  });
  const onSubmit = (data: A) => {
    registerMutate({
      phone: data.phone,
      password: data.password,
      referral_code: referral_code as string,
    });
    router.refresh();
  };
  return (
    <section className="flex h-screen w-screen items-start justify-center overflow-hidden bg-white md:items-center md:bg-primary_color/20">
      <section className="shadow-dropdown h-full w-full overflow-y-auto rounded-xl bg-transparent p-6 md:h-fit md:max-h-[85vh] md:w-4/5 md:bg-white md:p-10 lg:w-2/3">
        <Logo isAlwaysShow />
        <section className="mt-10 flex items-end gap-x-10 md:mt-5">
          <section className="flex-1">
            <Link href="/" className="mb-4 flex items-center gap-x-2 font-medium hover:underline">
              <ChevronLeft />
              Trang chủ
            </Link>
            <p className="mb-4 block text-sm text-secondary lg:hidden">
              {data.description} {' sau khi'}
              <strong className="text-primary_color"> đăng ký thành công</strong>
            </p>
            <h1 className="text-2xl font-semibold text-primary_color xl:text-3xl">
              Đăng ký tài khoản
            </h1>
            <Form {...form}>
              <form className="mt-4 flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        aria-required
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium"
                      >
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
                  className="text-md my-4 w-full rounded-md bg-primary_color/80 px-4 py-2 font-semibold text-white hover:bg-primary_color focus:animate-pulse"
                >
                  {isRegister ? 'Đang xác thực' : 'Đăng ký'}
                </Button>
              </form>
            </Form>
            <div className="my-4 flex w-full items-center justify-between gap-x-2">
              <span className="block h-[1px] flex-1 bg-slate-300" />
              <span className="px-2 text-center text-sm text-gray-500">Hoặc </span>
              <span className="block h-[1px] flex-1 bg-slate-300" />
            </div>
            <LoginSocial
              className="mb-0"
              handleSuccessLogin={() => {
                const redirectUrl = searchParams?.get('redirectUrl');
                router.push(redirectUrl as string);
              }}
            />
          </section>
          <section className="hidden h-full flex-1 lg:block">
            <p className="mb-4">
              {data.description} {' sau khi'}
              <strong className="text-primary_color"> đăng ký thành công</strong>
            </p>
            <Image draggable={false} alt="forgot-password" src={forgot_password} />
          </section>
        </section>
      </section>
    </section>
  );
};

export default ReferralFriendPage;
