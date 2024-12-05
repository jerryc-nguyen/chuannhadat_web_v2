'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  SelectSeparator
} from '@/components/ui/select';
import { buildOptionsPrice, maskNumber } from '@common/priceHelpers';
import { Checkbox } from '@components/ui/checkbox';
import { Separator } from '@components/ui/separator';
import { BadgeInfo } from 'lucide-react';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { directionOptions, furnitureTypeOptions, phapLyTypeOptions } from '../../constant';
import { CommonSelect } from '../CommonSelect';
import { PriceAutoComplete } from './fields/price-autocomplete';
import { RoundedOptionsNumberInput } from './fields/rounded-options-number-input';

const ProductInfoForm: React.FC<A> = ({ form }) => {
  const price_in_vnd = form.watch('price_in_vnd');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    // Regular expression to allow only numbers, with one optional comma or period, not at the beginning
    const regex = /^(?![.,])\d+([.,]\d{0,})?$/;

    if (regex.test(value) || value === '') {
      field.onChange(value); // Update the value only if it matches the regex
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <BadgeInfo /> Thông tin Bất động sản
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="grid gap-2">
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
                    placeholder="Nhập diện tích (m²)"
                    maxLength={10}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phap_ly"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Giấy tờ pháp lý</FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[{ text: 'Không xác định', value: '__default' }, ...phapLyTypeOptions]}
                    actions={
                      <>
                        <SelectSeparator />
                        <Button
                          className="w-full px-2"
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            form.setValue('phap_ly', '');
                          }}
                        >
                          Xóa lựa chọn
                        </Button>
                      </>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price_in_vnd"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  <span className="text-red-600">*</span> Giá bán/ thuê (VNĐ)
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
                    />
                  }
                />

                <div
                  className={`flex ${form.formState.errors.price_in_vnd ? 'justify-between' : 'justify-end'}`}
                >
                  <FormMessage />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      onCheckedChange={(value) => {
                        if (value) {
                          form.setValue('price_in_vnd', 'Thỏa thuận');
                        } else {
                          form.setValue('price_in_vnd', '');
                        }
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Giá Thương lượng
                    </label>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="bedrooms_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số phòng ngủ</FormLabel>
                  <RoundedOptionsNumberInput
                    {...field}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                    maxLength={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số phòng tắm</FormLabel>
                  <RoundedOptionsNumberInput
                    {...field}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                    maxLength={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facade"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Mặt tiền</FormLabel>
                  <Input
                    {...field}
                    value={maskNumber(field.value).formattedValue}
                    onChange={(e) => {
                      const { rawValue } = maskNumber(e.target.value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    placeholder="Nhập số"
                    endAdornment={
                      <span>
                        <b>m</b>
                      </span>
                    }
                    maxLength={8}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entrance"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Đường rộng</FormLabel>
                  <Input
                    {...field}
                    value={maskNumber(field.value).formattedValue}
                    onChange={(e) => {
                      const { rawValue } = maskNumber(e.target.value);
                      onChangeFieldNumber(field, rawValue);
                    }}
                    placeholder="Nhập số"
                    endAdornment={
                      <span>
                        <b>m</b>
                      </span>
                    }
                    maxLength={8}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="floors_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số tầng</FormLabel>
                  <RoundedOptionsNumberInput
                    {...field}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                    maxLength={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entrance_direction"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Hướng nhà/ đất</FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[{ text: 'Không xác định', value: '__default' }, ...directionOptions]}
                    actions={
                      <>
                        <SelectSeparator />
                        <Button
                          className="w-full px-2"
                          size="sm"
                          onClick={(e) => {
                            form.setValue('entrance_direction', '');
                          }}
                        >
                          Xóa lựa chọn
                        </Button>
                      </>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="view_direction"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Hướng ban công</FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[{ text: 'Không xác định', value: '__default' }, ...directionOptions]}
                    actions={
                      <>
                        {' '}
                        <SelectSeparator />
                        <Button
                          className="w-full px-2"
                          size="sm"
                          onClick={(e) => {
                            form.setValue('view_direction', '');
                          }}
                        >
                          Xóa lựa chọn
                        </Button>
                      </>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="furniture"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Nội thất</FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[{ text: 'Không xác định', value: '__default' }, ...furnitureTypeOptions]}
                    actions={
                      <>
                        <SelectSeparator />
                        <Button
                          className="w-full px-2"
                          size="sm"
                          onClick={(e) => {
                            form.setValue('furniture', '');
                          }}
                        >
                          Xóa lựa chọn
                        </Button>
                      </>
                    }
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

export default ProductInfoForm;
