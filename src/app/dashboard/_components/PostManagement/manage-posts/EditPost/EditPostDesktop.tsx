'use client';

import React from 'react';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { Form } from '@/components/ui/form';
import ImageForm from '../components/form-components/image-form';

import ProductDescriptionForm from '../components/form-components/product-description';
import ProductInfoForm from '../components/form-components/product-info-form';
import ProductTypeForm from '../components/form-components/product-type';
import ProjectForm from '../components/form-components/project-form';
import LocationFields from '../components/form-components/LocationFields';
import { useEditPostForm } from './hooks';
import { DASHBOARD_ROUTES } from '@common/router';
import { Loader2 } from 'lucide-react';
import { useScrollToInvalidField } from '@dashboard/hooks/scrollToInvalidField';
import { invalidPriority } from '../constants';
import { useFixedBottomBar } from '@dashboard/hooks/useFixedBottomBar';

interface EditPostDesktopProps {
  productUid: string;
}

const EditPostDesktop: React.FC<EditPostDesktopProps> = ({ productUid }) => {
  const { form, onSubmit } = useEditPostForm(productUid);

  const scrollToInvalid = useScrollToInvalidField(form, invalidPriority);
  const handleInvalid = (errors: Record<string, unknown>) => {
    scrollToInvalid(errors);
  };

  // Fixed bottom bar via reusable hook (align to parent width/left)
  const { ref: bottomBarRef, style: fixedStyle } = useFixedBottomBar<HTMLDivElement>(undefined, {
    bottom: 0,
    zIndex: 40,
    alignTo: 'parent',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleInvalid)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <div className="grid items-start gap-6 lg:col-span-3">
            <ProductTypeForm form={form} />
            <ProjectForm form={form} />
            <LocationFields form={form} />
            <ProductDescriptionForm form={form} />
            <div key="product-info-wrapper">
              <ProductInfoForm form={form} />
            </div>
            <div key="image-form-wrapper">
              <ImageForm form={form} />
            </div>
          </div>
        </div>
        <div ref={bottomBarRef} className="flex justify-between rounded-lg border bg-card p-3 items-center" style={fixedStyle}>
          <Link href={DASHBOARD_ROUTES.posts.index}>
            Trở lại
          </Link>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Cập nhật tin
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPostDesktop;
