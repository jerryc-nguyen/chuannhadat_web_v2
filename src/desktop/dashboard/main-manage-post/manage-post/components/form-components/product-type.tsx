'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@components/ui/separator';
import { BadgeInfo } from 'lucide-react';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { businessTypeOptions, categoryTypeOptions } from '../../constant';
import { CommonSelect } from '../CommonSelect';

interface IProductTypeForm {
  form: UseFormReturn<A>;
}

const ProductTypeForm: React.FC<IProductTypeForm> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <BadgeInfo /> Loại giao dịch
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    <span className="text-red-600">*</span> Nhu cầu của bạn là
                  </FormLabel>

                  <CommonSelect
                    onChange={field.onChange}
                    options={businessTypeOptions}
                    value={field.value}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_type"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>
                    <span className="text-red-600">*</span> Loại bất động sản
                  </FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    options={categoryTypeOptions}
                    value={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTypeForm;
