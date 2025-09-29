'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@components/ui/button';
import { FormProvider } from 'react-hook-form';
import { CreateForm } from '../../NewPost/mobile/CreateForm';
import { useEditPostForm } from '../hooks';

interface EditPostMobileProps {
  productUid: string;
}

const EditPostMobile: React.FC<EditPostMobileProps> = ({ productUid }) => {
  const { form, onSubmit } = useEditPostForm(productUid);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show buttons after component mounts
    setIsVisible(true);
  }, []);

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <>
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
          {/* Add bottom padding to prevent content from being hidden behind sticky buttons */}
          <div className="h-20" />
        </form>
      </FormProvider>

      {/* Fixed bottom buttons for mobile */}
      {isVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t shadow-lg p-4 flex justify-between items-center"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          <Button type="button" onClick={handleSubmit} className="w-full">
            Cập nhật tin
          </Button>
        </div>
      )}
    </>
  );
};

export default EditPostMobile;
