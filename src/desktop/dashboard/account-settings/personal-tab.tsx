'use client';
import { listCustomerGender, listCustomerType } from '@common/constants';
import { cn, toastSucess } from '@common/utils';
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
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@components/ui/input';
import Image from 'next/image';
import { CustomerGender, CustomerType } from '@models/enums';
import useAuth from '@mobile/auth/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { LuLoader2, LuUpload } from 'react-icons/lu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { services } from '@api/services';
import { AxiosError } from 'axios';
import { IModalUpdateProfile } from '@models/interface/IModalProfiles';

const PersonalTab: React.FC = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  // Update profile me
  const { mutate: updateMyProfile, isPending: isUpdateProfilePending } = useMutation({
    mutationFn: services.profiles.updateMyProfile,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-profile-me'],
      });
      toastSucess('Cập nhật thông tin thành công');
    },
  });
  // Upload avatar
  const { mutate: updateMyAvatar, isPending: isUpdateAvatarPending } = useMutation({
    mutationFn: services.profiles.updateMyAvatar,
    onError: (err: AxiosError<A>) => {
      console.error('Error fetching update', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-profile-me'],
      });
      toastSucess('Cập nhật thông tin thành công');
      reset();
    },
  });
  const formSchema = z
    .object({
      customerType: z.nativeEnum(CustomerType),
      displayName: z.string().min(2, {
        message: 'Vui lòng nhập tên hiển thị',
      }),
      customerGender: z.nativeEnum(CustomerGender),
      jobTitle: z.string().optional(),
      experience: z.string().min(0).max(100).optional(),
      workplace: z.string().optional(),
      aboutMe: z.string().optional(),
    })
    .transform((values) => {
      if (values.customerType === CustomerType.Customer) {
        return {
          customerType: values.customerType,
          displayName: values.displayName,
          customerGender: values.customerGender,
        };
      }
      // Nếu không, trả về tất cả các giá trị ban đầu
      return values;
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerType: CustomerType.Customer,
      customerGender: CustomerGender.Male,
      displayName: '',
      jobTitle: '',
      experience: '0',
      workplace: '',
      aboutMe: '',
    },
  });
  const { register, reset, handleSubmit, control, getValues, clearErrors } = form;
  const handleUploadAvatar = () => {
    inputFileRef.current?.click();
  };
  const handleFileChange = (event: EventInput) => {
    const file = event.target.files?.[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    updateMyAvatar(formData);
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    const defaultPayload = {
      full_name: values.displayName,
      role: values.customerType,
      gender: values.customerGender,
    };
    const formatDataPayload: IModalUpdateProfile =
      values.customerType === CustomerType.Customer
        ? defaultPayload
        : {
            ...defaultPayload,
            exp_years: values.experience ? parseInt(values.experience) : undefined,
            gender: values.customerGender,
            address: values.workplace,
            description: values.aboutMe,
          };
    updateMyProfile(formatDataPayload);
  }
  React.useEffect(() => {
    if (currentUser) {
      reset({
        customerType:
          currentUser.profile_tags[0] === 'Cá nhân' ? CustomerType.Customer : CustomerType.Broker,
        customerGender: currentUser.gender as CustomerGender,
        displayName: currentUser.full_name,
        workplace: currentUser.address || '',
        experience: '0',
        jobTitle: currentUser.job_title || '',
        aboutMe: currentUser.description || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <section>
      <div className="border-b pb-4">
        <h3 className="text-xl font-semibold">Tài khoản của bạn</h3>
        <p className="text-xs text-slate-400">Thông tin chi tiết về tài khoản</p>
      </div>
      <Form {...form}>
        <form className="mt-4 flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <FormItem className="flex flex-col items-center justify-between gap-y-4 xl:flex-row">
            <div className="flex flex-col items-center gap-x-4 gap-y-2 lg:flex-row">
              <Avatar className="h-[100px] w-[100px]">
                <AvatarImage src={currentUser?.avatar_url} alt="avatar" />
                <AvatarFallback>
                  {getValues('displayName')?.slice(0, 2) || 'No name'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-y-1 lg:items-start">
                <span className="font-semibold">Ảnh đại diện</span>
                <span className="text-xs text-slate-300">PNG,JPG dưới 15Mb</span>
              </div>
            </div>
            <FormControl>
              <div className="flex gap-x-2">
                <div className="relative">
                  <Button
                    onClick={handleUploadAvatar}
                    className="cursor-pointer shadow-sm"
                    variant={'outline'}
                    disabled={isUpdateAvatarPending}
                    type="button"
                  >
                    {isUpdateAvatarPending ? (
                      <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LuUpload className="mr-1" />
                    )}
                    Tải hình ảnh lên
                  </Button>
                  <Input
                    accept=".jpg, .png"
                    ref={inputFileRef}
                    type="file"
                    onChange={handleFileChange}
                    className="absolute hidden"
                  />
                </div>
                <Button type="button" variant={'destructive'}>
                  Xóa ảnh
                </Button>
              </div>
            </FormControl>
          </FormItem>
          <div className="form-customer_type">
            <FormLabel aria-required={true} className="text-base">
              Bạn là
            </FormLabel>
            <div className="mt-2 flex flex-col justify-between gap-x-4 gap-y-2 lg:flex-row">
              {listCustomerType.map((item) => (
                <FormLabel
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    'flex flex-1 cursor-pointer justify-between gap-x-2 space-x-3 space-y-0 rounded-lg border-2 bg-white p-3 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-300',
                    getValues('customerType') === item.id
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : 'text-slate-900',
                  )}
                >
                  <Image
                    src={item.icon}
                    alt="broker"
                    width={60}
                    className="hidden object-contain xl:block"
                  />
                  <div>
                    <strong className="text-lg">{item.title}</strong>
                    <p className="text-xs text-slate-400 md:block">{item.content}</p>
                  </div>
                  <input
                    id={item.id}
                    type="radio"
                    {...register('customerType')}
                    onChange={(event) => {
                      clearErrors();
                      register('customerType').onChange(event);
                    }}
                    value={item.id}
                    className="mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                </FormLabel>
              ))}
            </div>
          </div>
          <FormField
            control={control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel aria-required={true} className="text-base">
                  Tên hiển thị
                </FormLabel>
                <FormControl>
                  <Input placeholder="Tên hiển thị trên website.." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {getValues('customerType') === CustomerType.Broker && (
            <>
              <FormField
                control={control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Chức danh</FormLabel>
                    <FormControl>
                      <Input placeholder="Mô tả ngắn gọn công việc của bạn" {...field} />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Ví dụ: Chuyên gia môi giới và tư vấn đầu tư BĐS tại HCM Chuyên gia môi giới
                      căn hộ cao cấp Q7, Q8 HCM
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Số năm kinh nghiệm</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Số năm kinh nghiệm của bạn"
                        // min={0}
                        // max={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="workplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Nơi làm việc</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ văn phòng hoặc nơi ban đang ở" {...field} />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Ví dụ: Q.Tân Bình, Hồ Chí Minh
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="form-customer_gender">
            <FormLabel aria-required={true} className="text-base">
              Giới tính
            </FormLabel>
            <div className="mt-2 flex gap-x-4">
              {listCustomerGender.map((item) => (
                <FormLabel
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center space-x-3 space-y-0 rounded-lg border-2 bg-white p-3 text-slate-900 shadow-sm hover:border-blue-300',
                    getValues('customerGender') === item.id
                      ? 'border-blue-300 bg-blue-50 text-blue-600'
                      : '',
                  )}
                >
                  <input
                    id={item.id}
                    type="radio"
                    {...register('customerGender')}
                    value={item.id}
                    className="mr-2 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  {item.title}
                </FormLabel>
              ))}
            </div>
          </div>
          {getValues('customerType') === CustomerType.Broker && (
            <FormField
              control={control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Giới thiệu về bạn</FormLabel>
                  <FormControl>
                    <Input placeholder="Điều mà khách ghé thăm có thể nhìn thấy" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <Button disabled={isUpdateProfilePending} className="w-fit" type="submit">
            {isUpdateProfilePending && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default PersonalTab;
