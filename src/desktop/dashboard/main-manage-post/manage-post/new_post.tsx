'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ProductInfoForm from './components/form-components/product-info-form';
import { businessTypeOptions, categoryTypeOptions } from './constant';

import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import { useIsMobile, useSyncQueryToUrl } from '@hooks';
import Link from 'next/link';
import { toast } from 'sonner';
import { IPostForm } from '../types';
import ProductApiService from './apis/product-api';
import ImageForm from './components/form-components/image-form';
import LocationFormV2 from './components/form-components/location-form-v2';
import ProductDescriptionForm from './components/form-components/product-description';
import ProductTypeForm from './components/form-components/product-type';
import { PostFormSchema } from './form-schemas';


import React from 'react';
import { FormMobile } from './mobile/form-create';

/**
 * TODO: Split file to smaller components
 * TODO: Refactor code
 */

const defaultValues: IPostForm = {
  description: '',
  business_type: businessTypeOptions[0].value ?? '',
  category_type: categoryTypeOptions[0].value ?? '',
  title: '',
  area: '',
  phap_ly: '',
  price_in_vnd: '',
  city_id: 1,
  district_id: 55,
  ward_id: undefined,
  street_id: undefined,
  project_id: '',
  full_address: '',
  bedrooms_count: '5',
  bathrooms_count: '3',
  facade: '',
  entrance: '',
  floors_count: '',
  entrance_direction: '',
  view_direction: '',
  furniture: '',
  image_ids: '',
  youtube_url: '',
} as const;

const NewPost: React.FC = () => {
  useSyncQueryToUrl({ hide_create_post: true }); // use hide create post button on navbar
  
  const isMobile = useIsMobile();

  const form = useForm<IPostForm>({
    // @ts-expect-error: ok
    resolver: yupResolver(PostFormSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  const onSubmit = async () => {
    try {
      const params = form.getValues();
      const res = await ProductApiService.Create(params);
      console.log('resssssssss', res);

      if (res.status) {
        toast.success('Đăng tin thành công');
        setTimeout(() => {
          window.location.href = '/dashboard/manage-post/collection-post';
        }, 1500);
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Đăng tin không thành công');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('done');
    }
  };

  console.log({ errors: form.formState.errors, values: form.watch() });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          {isMobile ? (
            <FormMobile />
          ) : (
            <div className="grid items-start gap-6 lg:col-span-3">
              <ImageForm form={form} />
              <ProductTypeForm form={form} />
              <LocationFormV2 form={form} />
              <ProductDescriptionForm form={form} />
              <ProductInfoForm form={form} />
            </div>
          )}
          {/* <div className="grid items-start gap-6 lg:col-span-1 top-2 sticky">
            <ProductConfigForm />
          </div> */}
        </div>
        <div className="sticky bottom-2 z-[40] mt-6 flex justify-between rounded-lg border bg-card p-3">
          <Link href={`/dashboard/manage-post/collection-post`}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button type="submit">Đăng tin và thanh toán</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPost;
