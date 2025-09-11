'use client';

import React from 'react';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { FormProvider } from 'react-hook-form';
import { CreateForm } from '../../NewPost/mobile/CreateForm';
import { useEditPostForm } from '../hooks';
import { DASHBOARD_ROUTES } from '@common/router';

interface EditPostMobileProps {
  productUid: string;
}

const EditPostMobile: React.FC<EditPostMobileProps> = ({ productUid }) => {
  const { form, onSubmit } = useEditPostForm(productUid);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <CreateForm />
          </div>
          {/* <div className="grid items-start gap-6 lg:col-span-1 top-2 sticky">
            <ProductConfigForm />
          </div> */}
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
    </FormProvider>
  );
};

export default EditPostMobile;
