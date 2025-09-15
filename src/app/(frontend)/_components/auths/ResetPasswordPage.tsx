'use client';
import Logo from '@components/logo';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import {
  PasswordInput,
  SuccessMessage,
  usePasswordReset,
  useResetPasswordForm
} from './reset-password';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Custom hooks
  const {
    form,
    handleSubmit,
    control,
    setFocus,
    showNewPassword,
    showConfirmPassword,
    toggleNewPasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useResetPasswordForm();

  const {
    isSuccess,
    isPending,
    handleSubmit: onSubmit,
    handleLoginClick,
    handleInvalidToken,
  } = usePasswordReset(token, setFocus);

  // Redirect if no token
  useEffect(() => {
    handleInvalidToken();
  }, [handleInvalidToken]);

  if (isSuccess) {
    return <SuccessMessage onLoginClick={handleLoginClick} />;
  }

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <section className="flex min-h-[100dvh] items-center justify-center overflow-x-hidden bg-[#fefdf9]">
      <section className="shadow-dropdown flex h-full w-full flex-col overflow-hidden rounded-xl bg-transparent md:h-fit md:w-4/5 md:flex-row md:bg-white lg:w-2/3">
        <section className="px-5 py-10 md:w-1/2 md:p-10">
          <Logo isAlwaysShow />
          <Link href="/users/forgot-password" className="my-4 flex items-center gap-x-2 font-medium hover:underline">
            <ChevronLeft />
            Quên mật khẩu
          </Link>
          <h1 className="mb-8 text-2xl font-semibold md:text-3xl xl:text-4xl">
            Đặt lại mật khẩu
          </h1>
          <p className="mb-6 text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 6 ký tự.
          </p>

          <Form {...form}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Mật khẩu mới</FormLabel>
                    <FormControl>
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Nhập mật khẩu mới"
                        showPassword={showNewPassword}
                        onToggleVisibility={toggleNewPasswordVisibility}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <PasswordInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Nhập lại mật khẩu mới"
                        showPassword={showConfirmPassword}
                        onToggleVisibility={toggleConfirmPasswordVisibility}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary_color hover:bg-primary_color/80"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đặt lại mật khẩu
              </Button>
            </form>
          </Form>
        </section>

        <div className="relative flex w-full items-center overflow-x-hidden bg-[url(https://cdn.tailkit.com/media/landing/components-hero.png)] bg-cover bg-right-bottom px-6 py-10 dark:bg-center md:w-1/2 md:px-10 lg:p-16">
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-sm dark:bg-gray-800/95"></div>
          <div className="relative text-center md:text-left">
            <p className="mb-2 font-semibold leading-relaxed text-white">
              &quot;Bảo mật tài khoản là ưu tiên hàng đầu của chúng tôi&quot;
            </p>
            <p className="text-sm text-gray-200">Chuẩn Nhà Đất Team</p>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ResetPasswordPage;
