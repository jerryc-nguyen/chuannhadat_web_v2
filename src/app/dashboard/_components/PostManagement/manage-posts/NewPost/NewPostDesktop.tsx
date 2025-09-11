'use client';

import React from 'react';
import ProductInfoForm from '../components/form-components/product-info-form';
import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import ImageForm from '../components/form-components/image-form';
import LocationFormV2 from '../components/form-components/location-form-v2';
import ProductDescriptionForm from '../components/form-components/product-description';
import ProductTypeForm from '../components/form-components/product-type';
import ProjectForm from '../components/form-components/project-form';
import { useNewPostForm } from './hooks';
import { DASHBOARD_ROUTES } from '@common/router';

const NewPostDesktop: React.FC = () => {
  const { form, onSubmit } = useNewPostForm('desktop');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <ProductTypeForm form={form} />
            <ProjectForm form={form} />
            <LocationFormV2 form={form} />
            <ProductDescriptionForm form={form} />
            <ProductInfoForm form={form} />
            <ImageForm form={form} />
          </div>
        </div>
        <div className="sticky bottom-2 z-[40] mt-6 flex justify-between rounded-lg border bg-card p-3">
          <Link href={DASHBOARD_ROUTES.posts.index}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button type="submit" data-testid="submitPostBtn">Đăng tin và thanh toán</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPostDesktop;
