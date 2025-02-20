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
import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '@mobile/auth/hooks/useAuth';
import { Button } from '@components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LuLoader2 } from 'react-icons/lu';
import { service } from '../../apis';
import { toast } from 'sonner';

const ContactInfor: React.FC = () => {
  const { currentUser } = useAuth();

  const formSchema = z.object({
    zaloPhone: z.string(),
    facbookUrl: z.string(),
    websiteUrl: z.string(),
    youtubeChanel: z.string(),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zaloPhone: '',
      facbookUrl: '',
      websiteUrl: '',
      youtubeChanel: '',
    },
  });
  const { handleSubmit, control, reset } = form;

  React.useEffect(() => {
    if (currentUser) {
      reset({
        zaloPhone: '',
        facbookUrl: currentUser.facebook_url,
        websiteUrl: currentUser.website_url,
        youtubeChanel: currentUser.youtube_url,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const queryClient = useQueryClient();

  // Update schedule time
  const { mutate: updateMyProfile, isPending: isUpdateProfilePending } = useMutation({
    mutationFn: service.profiles.updateMyProfile,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-profile-me'] });
      toast.success('Cập nhật thông tin thành công');
      reset();
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMyProfile({
      facebook_url: values.facbookUrl,
      website_url: values.websiteUrl,
      youtube_url: values.youtubeChanel,
      full_name: currentUser?.full_name || '',
    });
  }
  return (
    <section>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Thông tin liên hệ</h3>
      </div>
      <Form {...form}>
        <form className="mt-4 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel className="text-base">Email</FormLabel>
            <FormControl>
              <Input disabled placeholder="Email đăng ký" />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel className="text-base">Số điện thoại</FormLabel>
            <FormControl>
              <Input value={currentUser?.phone} disabled placeholder="Số điện thoại sử dụng" />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormField
            control={control}
            name="zaloPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Zalo</FormLabel>
                <div className="flex">
                  <Input
                    value="https://zalo.me/"
                    disabled
                    className="!mt-0 w-1/4 !rounded-r-none border-r-0 text-black dark:text-white"
                  />
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={12}
                      className="!mt-0 !rounded-l-none"
                      placeholder="Nhập số điện thoại Zalo"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <div className="mt-2 border-b pb-4">
            <h3 className="text-xl font-semibold">Trang của bạn</h3>
          </div>
          <FormField
            control={control}
            name="facbookUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Facebook URL</FormLabel>
                <FormControl>
                  <Input placeholder="Facebook hoặc trang cá nhân" {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  Ví dụ: https://www.facebook.com/demo
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="Website của bạn" {...field} />
                </FormControl>
                <FormDescription className="text-sm">Ví dụ: https://www.domain.com</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="youtubeChanel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Kênh Youtube</FormLabel>
                <FormControl>
                  <Input placeholder="Kênh youtube của bạn" {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  Ví dụ: https://www.youtube.com/c/demo Ví dụ: https://www.youtube.com/channel/demo
                </FormDescription>
              </FormItem>
            )}
          />
          <Button disabled={isUpdateProfilePending} className="w-fit" type="submit">
            {isUpdateProfilePending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default ContactInfor;
