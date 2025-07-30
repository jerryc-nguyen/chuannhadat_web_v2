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
import { IoIosArrowBack } from 'react-icons/io';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { services } from '@api/services';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AiFillMessage } from 'react-icons/ai';
import TooltipHost from '@components/tooltip-host';
import { FaCircleCheck } from 'react-icons/fa6';
import CommonAlertDialog from '@components/common-dialog';
import { IVerifyPhoneResponse } from '@models/modelResponse';
import { SMS_PHONE_NUMBER } from '@common/constants';

type ForgotPasswordProps = object;
enum PopupType {
  SendingMessage = 0,
  VerifySuccess = 1,
}
const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [openPopupResetPassword, setOpenPopupResetPassword] = React.useState(false);
  const [resetPhone, setResetPhone] = React.useState('');
  const [account, setAccount] = React.useState<IVerifyPhoneResponse['data'] | undefined>(undefined);
  const [typePopup, setTypePopup] = React.useState(PopupType.SendingMessage);
  const [isCopied, setIsCopied] = React.useState(false);

  // Call api
  const { mutate: resetPassword } = useMutation({
    mutationFn: services.auth.checkResetPassword,
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
    mutationFn: services.auth.verifyPhone,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
    },

    onSuccess: (data) => {
      if (data.status) {
        setTypePopup(PopupType.SendingMessage);
        setOpenPopupResetPassword(true);
        setAccount(data.data);
      } else {
        toast.error(data.message);
        reset();
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
  const { handleSubmit, control, reset } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    checkPhone(values.phoneReset);
    setResetPhone(values.phoneReset);
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replaceAll('.', ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
            <div className="flex flex-col items-center justify-center gap-y-3">
              <FaCircleCheck className="text-5xl text-success_color" />
              <p>
                Tài khoản với SĐT <b className="text-primary_color">{resetPhone}</b> đã được cấp lại mật khẩu mới: <b className="text-success_color">123456</b>,
                vui lòng đăng nhập và thay đổi mật khẩu của bạn tại:
                <br />
                <b>Cài đặt tài khoản</b> / <b>Mật khẩu</b>
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-y-3">
              <AiFillMessage className="mx-auto text-5xl text-muted-foreground" />
              <div>
                <p>
                  Xin chào <b className="font-medium text-primary_color">{account?.name}</b>, để
                  reset lại mật khẩu, vui lòng soạn tin nhắn theo cú pháp sau :
                  <b className="text-primary_color/80"> reset</b> gửi đến{' '}
                  <TooltipHost content={isCopied ? 'Copy thành công' : 'Click vào để copy'}>
                    <b onClick={() => handleCopy(SMS_PHONE_NUMBER)} className="text-primary_color/80">
                      {SMS_PHONE_NUMBER}
                    </b>
                  </TooltipHost>
                </p>
              </div>
            </div>
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
              <IoIosArrowBack />
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
