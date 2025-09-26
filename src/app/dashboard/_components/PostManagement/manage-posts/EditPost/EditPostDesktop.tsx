'use client';

import React from 'react';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { Form } from '@/components/ui/form';
import ImageForm from '../components/form-components/image-form';
import LocationFormV2 from '../components/form-components/location-form-v2';
import ProductDescriptionForm from '../components/form-components/product-description';
import ProductInfoForm from '../components/form-components/product-info-form';
import ProductTypeForm from '../components/form-components/product-type';
import ProjectForm from '../components/form-components/project-form';
import { useEditPostForm } from './hooks';
import { DASHBOARD_ROUTES } from '@common/router';

interface EditPostDesktopProps {
  productUid: string;
}

const EditPostDesktop: React.FC<EditPostDesktopProps> = ({ productUid }) => {
  const { form, onSubmit } = useEditPostForm(productUid);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <ProductTypeForm form={form} />
            <ProjectForm form={form} />
            <LocationFormV2 form={form} />
            <ProductDescriptionForm form={form} />
            <div key="product-info-wrapper">
              <ProductInfoForm form={form} />
            </div>
            <div key="image-form-wrapper">
              <ImageForm form={form} />
            </div>
          </div>
        </div>
        <div className="sticky bottom-2 z-[40] mt-6 flex justify-between rounded-lg border bg-card p-3">
          <Link href={DASHBOARD_ROUTES.posts.index}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button type="submit">Cập nhật tin</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPostDesktop;
