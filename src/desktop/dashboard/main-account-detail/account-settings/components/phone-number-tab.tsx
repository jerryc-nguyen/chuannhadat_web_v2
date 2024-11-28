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
import { toast } from 'sonner';
import useAuth from '@mobile/auth/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuLoader2 } from 'react-icons/lu';
import { service } from '../../apis';
import { Skeleton } from '@components/ui/skeleton';
import { AiFillMessage } from 'react-icons/ai';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import TooltipHost from '@components/tooltip-host';
import { services } from '@api/services';
import { ILoginResponse } from '@mobile/auth/types';
import { FaCircleCheck } from 'react-icons/fa6';
import { SMS_PHONE_NUMBER } from '@common/constants';

export const PhoneNumberTab: React.FC = () => {
  const [openPopupVerifyPhone, setOpenPopupVerifyPhone] = React.useState(false);
  const { currentUser, updateCurrentUser } = useAuth();
  const [isCopied, setIsCopied] = React.useState(false);
  const isConfirmedPhone = currentUser ? currentUser?.phone_confirmed : true;
  const queryClient = useQueryClient();
  const { data: profileMe } = useQuery({
    queryKey: ['get-profile-me'],
    queryFn: services.profiles.getMyProfile,
    select: (data) => data.data,
    enabled: openPopupVerifyPhone && !isConfirmedPhone,
    refetchInterval: 2000,
  });

  React.useEffect(() => {
    updateCurrentUser(profileMe as ILoginResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileMe]);
  const formSchema = z.object({
    newPhoneNumber: z
      .string()
      .min(1, {
        message: 'Số điện thoại không được để trống, vui lòng nhập số điện thoại mới',
      })
      .min(7, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      })
      .max(10, {
        message: 'Vui lòng nhập số điện thoại hợp lệ',
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPhoneNumber: '',
    },
  });
  const { handleSubmit, control, reset } = form;

  const { mutate: updateMyPhone, isPending: isUpdateMyPhonePending } = useMutation({
    mutationFn: service.profiles.updateMyPhone,
    onError: (err: AxiosError<A>) => {
      console.error('Có lỗi khi gửi yêu cầu', err);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
        toast.success('Gửi yêu cầu thành công');
        setTimeout(() => {
          setOpenPopupVerifyPhone(true);
        }, 300);
      } else {
        toast.error(data.message);
      }
      reset();
    },
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replaceAll('.', ''));
      toast.success('Đã copy');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const popupVerifyPhone = () => {
    return (
      <AlertDialog open={openPopupVerifyPhone} onOpenChange={setOpenPopupVerifyPhone}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isConfirmedPhone ? 'Xác thực thành công' : 'Xác thực số điện thoại'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isConfirmedPhone ? (
                <div className="flex flex-col items-center justify-center gap-y-3">
                  <FaCircleCheck className="text-5xl text-success_color" />
                  <p>
                    SĐT <b className="text-success_color">{currentUser?.phone}</b> của bạn đã được
                    xác thực thành công.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-y-3">
                  <AiFillMessage className="text-5xl text-muted-foreground" />
                  <div>
                    Để xác thực, vui lòng soạn tin nhắn với cú pháp sau :
                    <br />
                    <br />
                    <b className="text-primary_color/80 text-2xl">xt</b> &nbsp;&nbsp; gửi đến &nbsp;&nbsp;
                    <TooltipHost content={isCopied ? 'Copy thành công' : 'Click vào để copy'}>
                      <b
                        onClick={() => handleCopy(SMS_PHONE_NUMBER)}
                        className="text-primary_color/80 text-2xl"
                      >
                        {SMS_PHONE_NUMBER}
                      </b>
                      {' '}
                      (<i onClick={() => handleCopy(SMS_PHONE_NUMBER)}>Sao chép</i>)
                    </TooltipHost>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Đóng</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMyPhone({ phone: values.newPhoneNumber });
  }
  return (
    <>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thay đổi số điện thoại</h3>
      </div>
      {!isConfirmedPhone && (
        <div className="mt-4 rounded-md border bg-primary_color/10 p-6">
          <p>
            Số điện thoại của bạn chưa được xác thực, vui lòng xác thực để sử dụng đầy đủ các tính
            năng
          </p>
          <span
            onClick={() => setOpenPopupVerifyPhone(true)}
            className="cursor-pointer font-medium text-primary_color underline"
          >
            Hướng dẫn xác thực
          </span>
        </div>
      )}
      {!currentUser ? (
        <Skeleton className="mt-4 h-6 w-[350px]" />
      ) : (
        currentUser.phone && (
          <p className="mt-4">
            Số điện thoại hiện tại của bạn là <b>{currentUser?.phone}</b>
            {' '}
            {!isConfirmedPhone && (<i>(chưa được xác thực)</i>)}
          </p>
        )
      )}
      <Form {...form}>
        <form className="mt-2 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="newPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required={true} className="text-base">
                  Số điện thoại mới
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="mt-2"
                    placeholder="Nhập số điện thoại mới"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isUpdateMyPhonePending} className="w-fit sm:bottom-0" type="submit">
            {isUpdateMyPhonePending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi thông tin
          </Button>
        </form>
      </Form>
      {popupVerifyPhone()}
    </>
  );
};
