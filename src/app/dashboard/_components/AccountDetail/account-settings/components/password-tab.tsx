import { Button } from '@components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../../api/profile';

const defaultValues = {
  currentPassword: '',
  newPassowrd: '',
  confirmPassword: '',
};
const PasswordTab: React.FC = () => {
  const newPasswordRef = React.useRef<string>('');

  // Update schedule time
  const { mutate: updateMyPassword, isPending: isUpdateMyPasswordPending } = useMutation({
    mutationFn: profileApi.updateMyPassword,
    onError: (err: AxiosError) => {
      console.error('Error fetching update', err);
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success('Cập nhật mật khẩu thành công');
      } else {
        toast.error(data.message);
      }
      reset();
    },
  });
  const formSchema = z.object({
    currentPassword: z
      .string()
      .min(1, {
        message: 'Mật khẩu hiện tại không được để trống, vui lòng điền để tiếp tục ',
      })
      .min(6, {
        message: 'Mật khẩu hiện tại phải tối thiểu 6 kí tự ',
      }),
    newPassowrd: z
      .string()
      .min(1, {
        message: 'Mật khẩu mới không được để trống, vui lòng điền để tiếp tục ',
      })
      .min(8, {
        message: 'Mật khẩu phải tối thiểu 8 kí tự ',
      })
      .refine((value) => {
        newPasswordRef.current = value;
        return true;
      }),
    confirmPassword: z
      .string()
      .min(1, {
        message: 'Mật khẩu xác nhận không được để trống, vui lòng điền để tiếp tục ',
      })
      .min(8, {
        message: 'Mật khẩu phải tối thiểu 8 kí tự ',
      })
      .refine(
        (value) => value === newPasswordRef.current,
        'Mật khẩu xác nhận không khớp mật khẩu mới',
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { handleSubmit, control, reset } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMyPassword({
      confirm_password: values.confirmPassword,
      new_password: values.newPassowrd,
      current_password: values.currentPassword,
    });
  }
  return (
    <section>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thay đổi mật khẩu</h3>
      </div>
      <Form {...form}>
        <form className="mt-4 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required className="text-base">
                  Mật khẩu hiện tại
                </FormLabel>

                <FormControl>
                  <Input type="password" placeholder="Mật khẩu hiện tại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="newPassowrd"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required className="text-base">
                  Mật khẩu mới
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Mật khẩu mới" {...field} />
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
                <FormLabel aria-required className="text-base">
                  Xác nhận mật khẩu mới
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Xác nhận mật khẩu mới" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription className="text-sm">Tối thiểu 8 kí tự</FormDescription>
              </FormItem>
            )}
          />
          <Button disabled={isUpdateMyPasswordPending} className="w-fit" type="submit">
            {isUpdateMyPasswordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default PasswordTab;
