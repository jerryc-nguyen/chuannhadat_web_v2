'use client';

import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { CreateForm } from './CreateForm';
import { useNewPostForm } from '../hooks';
import { DASHBOARD_ROUTES } from '@common/router';

const NewPostMobile: React.FC = () => {
  const { form, onSubmit } = useNewPostForm('mobile_web');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          <CreateForm />
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

export default NewPostMobile;
