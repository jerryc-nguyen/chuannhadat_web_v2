'use client';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@common/api/auth';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, ChevronLeft } from 'lucide-react';
import CommonAlertDialog from '@components/common-dialog';
import { IVerifyPhoneResponseData } from './types';
import ReceivedResetSms from './forgot-password/ReceivedResetSms';
import Guide from './forgot-password/Guide';

type ForgotPasswordProps = object;
enum PopupType {
  SendingMessage = 0,
  VerifySuccess = 1,
}
const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [openPopupResetPassword, setOpenPopupResetPassword] = React.useState(false);
  const [resetPhone, setResetPhone] = React.useState('');
  const [account, setAccount] = React.useState<IVerifyPhoneResponseData | undefined>(undefined);
  const [typePopup, setTypePopup] = React.useState(PopupType.SendingMessage);

  // Call api
  const { mutate: resetPassword } = useMutation({
    mutationFn: authApi.checkResetPassword,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
    },
    onSuccess: (data) => {
      if (data.status) {
        setTypePopup(PopupType.VerifySuccess);
      }
    },
  });
  const { mutate: checkPhone, isPending: isLoadingCheckPhone } = useMutation({
    mutationFn: authApi.verifyPhone,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
      toast.error(`Có lỗi khi kiểm tra số điện thoại: ${err.message}`);
      setFocus('phoneReset');
    },

    onSuccess: (response) => {
      if (response.status) {
        console.log('response', response);
        setTypePopup(PopupType.SendingMessage);
        setOpenPopupResetPassword(true);
        setAccount(response.data);
      } else {
        toast.error(response.message);
        setFocus('phoneReset');
      }
    },
  });

  React.useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(() => {
      openPopupResetPassword && resetPassword(resetPhone);
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [openPopupResetPassword, resetPassword, resetPhone]);

  //Schema and Submit
  const formSchema = z.object({
    phoneReset: z
      .string()
      .min(1, {
        message: 'Số điện thoại không được để trống.',
      })
      .min(7, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      })
      .max(10, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneReset: '',
    },
  });
  const { handleSubmit, control, setFocus } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    checkPhone(values.phoneReset);
    setResetPhone(values.phoneReset);
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replaceAll('.', ''));
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const popupResetPassword = () => {
    return (
      <CommonAlertDialog
        isOpen={openPopupResetPassword}
        handleOpenChange={setOpenPopupResetPassword}
        title={
          typePopup === PopupType.VerifySuccess
            ? 'Tạo lại mật khẩu thành công'
            : 'Hướng dẫn tạo lại mật khẩu'
        }
        description={
          typePopup === PopupType.VerifySuccess ? (
            <ReceivedResetSms resetPhone={resetPhone} />
          ) : (
            account && (
              <Guide
                account={account}
                onCopy={handleCopy}
              />
            )
          )
        }
        textButtonRight="Đóng"
      />
    );
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
            <h1 className="text-2xl font-semibold md:text-3xl xl:text-4xl">Quên mật khẩu ?</h1>
            <p className="mt-4">
              Đừng lo lắng, điều này xảy ra với tất cả chúng ta. Nhập số điện thoại của bạn dưới đây
              để khôi phục mật khẩu của bạn.
            </p>
            {account && (
              <p className="mt-4">
                Xin chào {account?.name}, vui lòng xem{' '}
                <b
                  onClick={() => setOpenPopupResetPassword(true)}
                  className="font-semibold text-primary_color hover:cursor-pointer hover:underline"
                >
                  hướng dẫn
                </b>{' '}
                để reset mật khẩu
              </p>
            )}
            <Form {...form}>
              <form
                className="mt-4 flex w-full flex-col gap-y-5 md:mt-12"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormField
                  control={control}
                  name="phoneReset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required={true} className="text-base">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          maxLength={11}
                          required
                          className="mt-2"
                          placeholder="Nhập số điện thoại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
      {popupResetPassword()}
    </section>
  );
};

export default ForgotPassword;
