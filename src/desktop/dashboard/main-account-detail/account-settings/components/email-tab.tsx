import { services } from '@api/services';
import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Skeleton } from '@components/ui/skeleton';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '@mobile/auth/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { LuLoader2 } from 'react-icons/lu';
import { toast } from 'sonner';
import * as Yup from 'yup';

const EmailTab: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const formSchema = Yup.object({
    newEmail: Yup.string()
      .email({
        message: 'Vui lòng nhập địa chỉ email hợp lệ',
      })
      .required(),
  });
  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      newEmail: '',
    },
  });
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = form;
  const { mutate: updateEmail, isPending } = useMutation({
    mutationFn: services.profiles.updateEmail,
    onError: (err: AxiosError<A>) => {
      toast.error(`Cập nhật email không thành công ${err.message}`);
    },
    onSuccess: async (data: A) => {
      if (data.status) {
        toast.success('Cập nhật email thành công');
        const data = await queryClient.fetchQuery({
          queryKey: ['get-profile-me'],
          queryFn: services.profiles.getMyProfile,
        });
        updateCurrentUser(data.data);
      } else {
        toast.error(data.message);
      }
      reset();
    },
  });

  function onSubmit(values: Yup.InferType<typeof formSchema>) {
    console.log(values);
    updateEmail(values.newEmail as string);
  }
  return (
    <section className="flex h-full flex-1 flex-col justify-between">
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thay đổi email</h3>
      </div>
      {currentUser?.unconfirmed_email && (
        <div className="mt-4 rounded-md border bg-primary_color/10 p-6">
          <p>
            Hệ thống đang chờ bạn xác thực email mới{' '}
            <b className="text-yellow-500">{currentUser.unconfirmed_email}</b>
          </p>
          <p>Nếu chưa nhận được email, bạn có thể yêu cầu lại bằng form bên dưới</p>
        </div>
      )}
      {!currentUser ? (
        <Skeleton className="mt-4 h-6 w-[350px]" />
      ) : (
        currentUser.email && (
          <p className="mt-4">
            Email hiện tại của bạn là <b>{currentUser.email}</b>
          </p>
        )
      )}
      <Form {...form}>
        <form className="mt-2 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    className="mt-2"
                    placeholder="Nhập địa chỉ email mới"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isPending} className="relative w-fit sm:bottom-0" type="submit">
            {isPending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EmailTab;
