'use client';
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
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import forgot_password from '@assets/icons/Forgot password-bro.svg';
import Image from 'next/image';
import { IoIosArrowBack } from 'react-icons/io';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

type ForgotPasswordProps = object;

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().min(1, { message: 'Vui lòng nhập email' }).email({
      message: 'Vui lòng nhập địa chỉ email hợp lệ',
    }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const { handleSubmit, control } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <section className="flex h-screen w-screen items-start justify-center bg-[#fefdf9] md:items-center">
      <section className="shadow-dropdown h-full w-full rounded-xl bg-transparent px-5 py-10 md:h-fit md:w-4/5 md:bg-white md:p-10 lg:w-2/3">
        <Logo isDashboard />
        <section className="mt-10 flex items-center gap-x-10 md:mt-5">
          <section className="flex-1">
            <Link
              href="/sign-in"
              className="mb-4 flex items-center gap-x-2 font-medium hover:underline"
            >
              <IoIosArrowBack />
              Đăng nhập
            </Link>
            <h1 className="text-2xl font-semibold md:text-3xl xl:text-4xl">Quên mật khẩu ?</h1>
            <p className="mt-4 text-muted-foreground">
              Đừng lo lắng, điều này xảy ra với tất cả chúng ta. Nhập email của bạn dưới đây để khôi
              phục mật khẩu của bạn
            </p>
            <Form {...form}>
              <form
                className="mt-4 flex w-full flex-col gap-y-5 md:mt-12"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required={true} className="text-base">
                        Địa chỉ email của bạn
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          required
                          className="mt-2"
                          placeholder="Nhập địa chỉ email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full bg-primary_color hover:bg-primary_color/80 sm:bottom-0"
                  type="submit"
                >
                  Gửi thông tin
                </Button>
              </form>
            </Form>
            <div className="my-6 flex w-full items-center justify-between gap-x-2">
              <span className="block h-[1px] flex-1 bg-slate-300" />
              <span className="px-2 text-center text-sm text-gray-500">Hoặc </span>
              <span className="block h-[1px] flex-1 bg-slate-300" />
            </div>
            <LoginSocial
              handleSuccessLogin={() => {
                router.push('/');
              }}
            />
          </section>
          <section className="hidden flex-1 lg:block">
            <Image alt="forgot-password" src={forgot_password} />
          </section>
        </section>
      </section>
    </section>
  );
};

export default ForgotPassword;
