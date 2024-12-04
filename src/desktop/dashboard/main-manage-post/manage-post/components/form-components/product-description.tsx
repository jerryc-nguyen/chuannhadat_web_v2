'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@components/ui/separator';
import { BadgeInfo } from 'lucide-react';
import { useIsMobile } from '@hooks';

// TODO: Remove ProductDescriptionForm component, use single field, add Typescript

const ProductDescriptionForm: React.FC<A> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <BadgeInfo /> Thông tin bài viết
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <InputTitle form={form} />

          <InputDescription form={form} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionForm;

interface InputTitleProps {
  form: A;
}

export function InputTitle({ form }: InputTitleProps) {
  const isMobile = useIsMobile();

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem className="grid gap-2">
          <FormLabel>
            <span className="text-red-600">*</span> Tiêu đề
          </FormLabel>
          <Textarea
              {...field}
              className="relative"
              rows={isMobile ? 3 : 1}
              placeholder="Nhập tiêu đề..."
              endAdornment={
                <span className="text-2xs absolute right-1 top-1">
                  {(form.getValues('title') || '').length}/99
                </span>
              }
            />

          <FormDescription>
            Tiêu đề ngắn gọn dễ hiểu, tối thiểu 30 ký tự và không được dài quá 99 ký tự.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
interface InputDescriptionProps {
  form: A;
}

export function InputDescription({ form }: InputDescriptionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>
              <span className="text-red-600">*</span> Nội dung mô tả
            </FormLabel>
            <Textarea
              {...field}
              className="min-h-[150px]"
              placeholder="Nhập mô tả..."
              endAdornment={
                <span className="text-2xs absolute right-1 top-1">
                  {(form.getValues('description') || '').length}/3000
                </span>
              }
            />
            <FormDescription>
              Nội dung mô tả tối thiểu 100 kí tự và không được dài quá 3000 ký tự.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
