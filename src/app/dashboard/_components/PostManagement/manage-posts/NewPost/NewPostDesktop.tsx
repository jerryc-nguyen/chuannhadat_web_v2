'use client';

import React, { useState } from 'react';
import ProductInfoForm from '../components/form-components/product-info-form';
import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageForm from '../components/form-components/image-form';
import ProductDescriptionForm from '../components/form-components/product-description';
import ProductTypeForm from '../components/form-components/product-type';
import ProjectForm from '../components/form-components/project-form';
import { useNewPostForm } from './hooks';
import { DASHBOARD_ROUTES } from '@common/router';
import LocationFields from '../components/form-components/LocationFields';
import { useScrollToInvalidField } from '@dashboard/hooks/scrollToInvalidField';
import { invalidPriority } from '../constants';

const NewPostDesktop: React.FC = () => {
  const { form, onSubmit } = useNewPostForm('desktop');
  const [disableSubmit, setDisableSubmit] = useState(false);

  const scrollToInvalid = useScrollToInvalidField(form, invalidPriority);
  const handleInvalid = (errors: Record<string, unknown>) => {
    // Re-enable submit when validation fails and scroll to the first invalid field
    setDisableSubmit(false);
    scrollToInvalid(errors);
  };

  const onSubmitHandled = async () => {
    // Disable immediately after validation passes to prevent double submits
    setDisableSubmit(true);
    const ok = await onSubmit();
    // Only re-enable if submit failed
    if (!ok) setDisableSubmit(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandled, handleInvalid)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <ProductTypeForm form={form} />
            <ProjectForm form={form} />
            <LocationFields form={form} />
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
          <Button
            type="submit"
            data-testid="submitPostBtn"
            disabled={disableSubmit || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng tin và thanh toán
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPostDesktop;
