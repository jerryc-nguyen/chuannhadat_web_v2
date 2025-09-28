'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { CreateForm } from './CreateForm';
import { useNewPostForm } from '../hooks';
import { DASHBOARD_ROUTES } from '@common/router';
import MobileContainer from '@dashboard/FinancialManagement/components/MobileContainer';

const NewPostMobile: React.FC = () => {
  const { form, onSubmit } = useNewPostForm('mobile_web');
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
      <MobileContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="button" onClick={handleSubmit} data-testid="submitPostBtn">
            Đăng tin và thanh toán
          </Button>
        </div>
      )}
    </>
  );
};

export default NewPostMobile;
