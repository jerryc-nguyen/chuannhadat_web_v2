import { services } from '@api/services';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toastSucess } from '@common/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuLoader2 } from 'react-icons/lu';

const PhoneNumberTab: React.FC = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Update my phone
  const { mutate: updateMyPhone, isPending: isUpdateMyPhonePending } = useMutation({
    mutationFn: services.profiles.updateMyPhone,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: (data: A) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
        toastSucess('Cập nhật số điện thoại thành công');
      } else {
        console.log('error');
        toast.error(data.message);
      }
      reset();
    },
  });
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
      newPhoneNumber: currentUser?.phone,
    },
  });
  const { handleSubmit, control, reset } = form;

  React.useEffect(() => {
    if (currentUser?.phone) {
      reset({
        newPhoneNumber: currentUser.phone,
      });
    }
  }, [currentUser?.phone, reset]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMyPhone({ phone: values.newPhoneNumber });
  }
  return (
    <>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thay đổi số điện thoại</h3>
      </div>
      <p className="mt-4">
        Số điện thoại hiện tại của bạn là <b>{currentUser?.phone}</b>
      </p>
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
          <Button
            disabled={isUpdateMyPhonePending}
            className="w-fit sm:absolute sm:bottom-0 sm:-translate-y-4"
            type="submit"
          >
            {isUpdateMyPhonePending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PhoneNumberTab;
