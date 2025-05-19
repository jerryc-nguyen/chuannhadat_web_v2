'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { BadgeInfo } from 'lucide-react';
import React, { useMemo } from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { businessTypeOptions, categoryTypeOptions } from '../../constant';
import { CommonSelect } from '../CommonSelect';
import { PriceAutoComplete } from './fields/price-autocomplete';
import { buildOptionsPrice, maskNumber, readMoney } from '@common/priceHelpers';
import { Input } from '@components/ui/input';
import { RoundedOptionsNumberInput } from './fields/rounded-options-number-input';

interface IProductTypeForm {
  form: UseFormReturn<A>;
}

const ProductTypeForm: React.FC<IProductTypeForm> = ({ form }) => {
  const price_in_vnd = form.watch('price_in_vnd');
  const businessType = form.watch('business_type');
  const categoryType = form.watch('category_type');

  // Check if it's land or land project
  const isLand = categoryType === 'dat' || categoryType === 'dat_nen_du_an';

  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    // Regular expression to allow only numbers, with one optional comma or period, not at the beginning
    const regex = /^(?![.,])\d+([.,]\d{0,})?$/;

    if (regex.test(value) || value === '') {
      field.onChange(value); // Update the value only if it matches the regex
    }
  };

  const priceLabel = useMemo(() => {
    return businessType == 'sell' ? 'Giá bán' : 'Giá cho thuê';
  }, [businessType])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <BadgeInfo /> Thông tin cơ bản
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-600">*</span> Nhu cầu
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
                <FormItem>
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

            <FormField
              control={form.control}
              name="price_in_vnd"
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>
                    <span className="text-red-600">*</span> {priceLabel} - <span className='text-secondary'>{readMoney(price_in_vnd)} VNĐ</span>
                  </FormLabel>
                  <PriceAutoComplete
                    selectedValue={price_in_vnd}
                    onSelectedValueChange={(value) => {
                      const { rawValue } = maskNumber(value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    items={buildOptionsPrice({
                      searchText: price_in_vnd,
                      businessType: form.getValues('business_type'),
                    })}
                    emptyMessage="Nhập giá bán"
                    InputRender={
                      <Input
                        {...field}
                        value={maskNumber(field.value).formattedValue}
                        placeholder="Nhập giá bán"
                        onChange={(e) => {
                          const { rawValue } = maskNumber(e.target.value);
                          onChangeFieldNumber(field, rawValue);
                        }}
                        maxLength={12}
                        disabled={form.getValues('price_in_vnd') === 'Thỏa thuận'}
                        endAdornment={
                          <span>
                            <b>VNĐ</b>
                          </span>
                        }
                      />
                    }
                  />

                  <div
                    className={`flex ${form.formState.errors.price_in_vnd ? 'justify-between' : 'justify-end'}`}
                  >
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-600">*</span> Diện tích (m²)
                  </FormLabel>
                  <Input
                    {...field}
                    value={maskNumber(field.value).formattedValue}
                    onChange={(e) => {
                      const { rawValue } = maskNumber(e.target.value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    placeholder="Nhập diện tích"
                    endAdornment={
                      <span>
                        <b>m²</b>
                      </span>
                    }
                    maxLength={10}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Only show bedroom fields if not land */}
            {!isLand && (
              <FormField
                control={form.control}
                name="bedrooms_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng ngủ</FormLabel>
                    <RoundedOptionsNumberInput
                      {...field}
                      className="relative"
                      placeholder="Nhập số khác"
                      onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                      maxLength={3}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Only show bathroom fields if not land */}
            {!isLand && (
              <FormField
                control={form.control}
                name="bathrooms_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số phòng tắm</FormLabel>
                    <RoundedOptionsNumberInput
                      {...field}
                      className="relative"
                      placeholder="Nhập số khác"
                      onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                      maxLength={3}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTypeForm;
