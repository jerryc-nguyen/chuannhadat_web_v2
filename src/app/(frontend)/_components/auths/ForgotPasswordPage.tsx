'use client';
import Logo from '@components/logo';
import { Button } from '@components/ui/button';
import { Form } from '@components/ui/form';
import Link from 'next/link';
import React from 'react';
import forgot_password from '@assets/icons/Forgot password-bro.svg';
import Image from 'next/image';
import { Loader2, ChevronLeft } from 'lucide-react';
import {
  WelcomeMessage,
  AccountGreeting,
  PhoneInput,
  PasswordResetPopup,
  useForgotPasswordForm,
  usePhoneVerification,
  usePasswordResetProcess,
} from './forgot-password';

const ForgotPassword: React.FC = () => {
  // Custom hooks
  const { form, handleSubmit, control, setFocus } = useForgotPasswordForm();

  const {
    account,
    typePopup,
    openPopupResetPassword,
    isLoadingCheckPhone,
    resetPassword,
    handleSubmit: onPhoneSubmit,
    handleCopy,
    handleShowGuide,
    setOpenPopupResetPassword,
  } = usePhoneVerification(setFocus, (phone: string) => setResetPhone(phone));

  const [resetPhone, setResetPhone] = React.useState('');

  // Handle password reset process polling
  usePasswordResetProcess({
    openPopupResetPassword,
    resetPassword,
    resetPhone,
  });

  const onSubmit = (data: { phoneReset: string }) => {
    onPhoneSubmit(data);
  };

  return (
    <section className="flex h-screen w-screen items-start justify-center bg-[#fefdf9] md:items-center">
      <section className="shadow-dropdown h-full w-full rounded-xl bg-transparent px-5 py-10 md:h-fit md:w-4/5 md:bg-white md:p-10 lg:w-2/3">
        <Logo isAlwaysShow />
        <section className="mt-10 flex items-center gap-x-10 md:mt-5">
          <section className="flex-1">
            <Link href="/" className="mb-4 flex items-center gap-x-2 font-medium hover:underline">
              <ChevronLeft />
              Trang chủ
            </Link>

            <WelcomeMessage />

            <AccountGreeting
              account={account}
              onShowGuide={handleShowGuide}
            />

            <Form {...form}>
              <form
                className="mt-4 flex w-full flex-col gap-y-5 md:mt-12"
                onSubmit={handleSubmit(onSubmit)}
              >
                <PhoneInput
                  control={control}
                  isPending={isLoadingCheckPhone}
                />

                <Button
                  disabled={isLoadingCheckPhone}
                  className="w-full bg-primary_color hover:bg-primary_color/80 sm:bottom-0"
                  type="submit"
                >
                  {isLoadingCheckPhone && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Gửi thông tin
                </Button>
              </form>
            </Form>
          </section>
          <section className="hidden flex-1 lg:block">
            <Image alt="forgot-password" src={forgot_password} />
          </section>
        </section>
      </section>

      <PasswordResetPopup
        isOpen={openPopupResetPassword}
        onClose={() => setOpenPopupResetPassword(false)}
        typePopup={typePopup}
        account={account}
        resetPhone={resetPhone}
        onCopy={handleCopy}
      />
    </section>
  );
};

export default ForgotPassword;
