'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CreateForm } from './CreateForm';
import { useNewPostForm } from '../hooks';
import { DASHBOARD_ROUTES } from '@common/router';
import MobileContainer from '@dashboard/FinancialManagement/components/MobileContainer';
import { useScrollToInvalidField } from '@dashboard/hooks/scrollToInvalidField';

const NewPostMobile: React.FC = () => {
  const { form, onSubmit } = useNewPostForm('mobile_web');
  const [isVisible, setIsVisible] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  useEffect(() => {
    // Show buttons after component mounts
    setIsVisible(true);
  }, []);

  const invalidPriority = [
    'price_in_vnd',
    'area',
    'city_id',
    'district_id',
    'ward_id',
    'street_id',
    'title',
    'description',
    'image_ids',
  ];

  const scrollToInvalid = useScrollToInvalidField(form, invalidPriority);
  const handleInvalid = (errors: Record<string, unknown>) => {
    // Re-enable submit when validation fails
    setDisableSubmit(false);
    scrollToInvalid(errors);
  };

  const onSubmitHandled = async () => {
    await onSubmit();
  };

  const handleSubmit = () => {
    // Lock the button immediately to prevent double click
    setDisableSubmit(true);
    form.handleSubmit(onSubmitHandled, handleInvalid)();
  };

  return (
    <>
      <MobileContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandled, handleInvalid)}>
            <div className="space-y-4">
              <CreateForm />
            </div>
            {/* Add bottom padding to prevent content from being hidden behind sticky buttons */}
            <div className="h-20" />
          </form>
        </Form>
      </MobileContainer>

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
          <Link href={DASHBOARD_ROUTES.posts.index}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button
            type="button"
            onClick={handleSubmit}
            data-testid="submitPostBtn"
            disabled={disableSubmit}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng tin và thanh toán
          </Button>
        </div>
      )}
    </>
  );
};

export default NewPostMobile;
