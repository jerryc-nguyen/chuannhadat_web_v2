import { profileApi } from '../../api/profile';
import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Skeleton } from '@components/ui/skeleton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@common/auth/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
  const { handleSubmit, control, setFocus } = form;
  const [unconfirmEmail, setUnconfirmEmail] = useState<string | undefined>(
    currentUser?.unconfirmed_email,
  );
  const { mutate: updateEmail, isPending } = useMutation({
    mutationFn: profileApi.updateEmail,
    onError: (err: AxiosError) => {
      toast.error(`Cập nhật email không thành công ${err.message}`);
      setFocus('newEmail');
    },
    onSuccess: async (data, variables) => {
      if (data.status) {
        toast.success('Gửi yêu cầu thay đổi email thành công');
        const profileData = await queryClient.fetchQuery({
          queryKey: ['get-profile-me'],
          queryFn: profileApi.getMyProfile,
        });
        updateCurrentUser(profileData.data);
        // Only set unconfirm email when API update is successful
        if (variables !== currentUser?.email) {
          setUnconfirmEmail(variables);
        }
      } else {
        toast.error(data.message);
        setFocus('newEmail');
      }
    },
  });

  useEffect(() => {
    if (currentUser?.email != currentUser?.unconfirmed_email) {
      setUnconfirmEmail(currentUser?.unconfirmed_email);
    }
  }, [currentUser]);

  function onSubmit(values: Yup.InferType<typeof formSchema>) {
    updateEmail(values.newEmail as string);
  }

  return (
    <section className="flex h-full flex-1 flex-col justify-between">
      <div className="border-b pb-3 mb-4">
        <h3 className="text-lg md:text-xl font-semibold">Thay đổi email</h3>
      </div>
      {unconfirmEmail && (
        <div className="mb-4 rounded-md border bg-primary_color/10 p-4 md:p-6">
          <b className="text-sm md:text-base">Bạn đã gửi yêu cầu cập nhật email mới!</b>
          <p className="text-sm mt-2">
            Hệ thống đã gửi một email xác thực đến email{' '}
            <b>{unconfirmEmail}</b>
          </p>
          <p className="text-sm mt-1">Nếu chưa nhận được email, bạn có thể yêu cầu lại bằng form bên dưới</p>
        </div>
      )}
      {!currentUser ? (
        <Skeleton className="mb-4 h-6 w-full max-w-[350px]" />
      ) : (
        currentUser.email && (
          <p className="mb-4 text-sm md:text-base">
            Email hiện tại của bạn là <b>{currentUser.email}</b>
          </p>
        )
      )}
      <Form {...form}>
        <form className="flex flex-col gap-y-4 md:gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required className="text-sm md:text-base">Email mới</FormLabel>
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
          <Button disabled={isPending} className="w-full md:w-fit mt-2" type="submit">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EmailTab;
