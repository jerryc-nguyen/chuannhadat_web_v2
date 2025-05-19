'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

  // Get selected property type
  const categoryType = form.watch('category_type');

  // Check if it's land or land project
  const isLand = categoryType === 'dat' || categoryType === 'dat_nen_du_an';

  // Check if it's a house
  const isHouse = categoryType === 'nha_rieng' ||
    categoryType === 'nha_mat_pho' ||
    categoryType === 'biet_thu_lien_ke' ||
    categoryType == 'nha_tro_phong_tro' ||
    categoryType == 'van_phong' || categoryType == 'cua_hang_kiot'

  // Check if it's an apartment
  const isApartment = categoryType === 'can_ho_chung_cu';

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
                placeholder="Chọn giấy tờ pháp lý"
                onChange={field.onChange}
                value={field.value}
                options={[{ text: 'Không xác định', value: '__default' }, ...phapLyTypeOptions]}
                showClear
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Mặt tiền - Hide for apartment */}
            {!isApartment && (
              <FormField
                control={form.control}
                name="facade"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{isHouse ? 'Mặt tiền rộng (m)' : 'Chiều ngang đất rộng (m)'}</FormLabel>
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
            )}

            {/* Đường rộng - Hide for apartment */}
            {!isApartment && (
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
            )}

            {/* Số tầng / Vị trí tầng - Hide for land */}
            {!isLand && (
              <FormField
                control={form.control}
                name="floors_count"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>{isApartment ? 'Vị trí tầng' : 'Số tầng'}</FormLabel>
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
            )}

            <FormField
              control={form.control}
              name="entrance_direction"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>{isApartment ? 'Hướng ban công' : 'Hướng nhà/ đất'}</FormLabel>
                  <CommonSelect
                    onChange={field.onChange}
                    value={field.value}
                    options={[{ text: 'Không xác định', value: '__default' }, ...directionOptions]}
                    showClear
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isHouse || isApartment) && (
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
                      showClear
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

export default ProductInfoForm;
