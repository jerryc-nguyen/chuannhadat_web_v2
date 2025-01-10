'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectSeparator } from '@/components/ui/select';
import { BadgeInfo } from 'lucide-react';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { directionOptions, furnitureTypeOptions, phapLyTypeOptions } from '../../constant';
import { CommonSelect } from '../CommonSelect';

const ProductInfoForm: React.FC<A> = ({ form }) => {

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
          <BadgeInfo /> Thông tin chi tiết
        </CardTitle>

      </CardHeader>
      <CardContent className="grid gap-6">
        <FormField
          control={form.control}
          name="phap_ly"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Giấy tờ pháp lý</FormLabel>
              <CommonSelect
                placeholder='Giấy tờ pháp lý'
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

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="facade"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Mặt tiền</FormLabel>
                  <Input
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      onChangeFieldNumber(field, e.target.value);
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
                    value={field.value}
                    onChange={(e) => {
                      onChangeFieldNumber(field, e.target.value);
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
              name="floors_count"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Số tầng</FormLabel>

                  <Input
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      onChangeFieldNumber(field, e.target.value);
                    }}
                    placeholder="Nhập số"
                    endAdornment={
                      <span>
                        <b>tầng</b>
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
                    options={[
                      { text: 'Không xác định', value: '__default' },
                      ...furnitureTypeOptions,
                    ]}
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
    </Card >
  );
};

export default ProductInfoForm;
