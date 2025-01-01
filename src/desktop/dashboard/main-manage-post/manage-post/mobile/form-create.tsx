'use client';

import { ControllerRenderProps, Form, useFormContext } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import List from '@components/konsta/List';
import { Input } from '@components/ui/input';
import ListItemBtsPicker from '@mobile/bts-pickers/ListItemBtsPicker';
import TestComponents from '@mobile/home/TestComponents';
import useModals from '@mobile/modals/hooks';
import { useMemo } from 'react';

import { CardTitle } from '@components/ui/card';

import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { buildOptionsPrice, maskNumber, readMoney } from '@common/priceHelpers';
import { Checkbox } from '@components/ui/checkbox';
import { Label } from '@components/ui/label';
import LocationsPicker from '@mobile/ui/LocationsPicker';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import {
  businessTypeOptions,
  categoryTypeOptions,
  directionOptions,
  furnitureTypeOptions,
  phapLyTypeOptions,
} from '../constant';
import { IPostForm } from '../../types';
import ImageForm, { InputYoutube, UploadImages } from '../components/form-components/image-form';
import ProductDescriptionForm, {
  InputDescription,
  InputTitle,
} from '../components/form-components/product-description';
import {
  PriceAutoComplete,
  PriceAutoCompleteListView,
} from '../components/form-components/fields/price-autocomplete';
import { RoundedOptionsNumberInput } from '../components/form-components/fields/rounded-options-number-input';
import { roomsOptionsForCreate, facadeOptionsForCreate } from '@mobile/filter_bds/constants';
import { Button } from '@components/ui/button';
import { ListItemPickCustomUI } from '@mobile/bts-pickers/ListItemPickCustomUI';

/**
 * TODO: Split file to smaller components
 * TODO: Refactor code
 */

export const FormMobile: React.FC = () => {
  const { openModal, closeModal } = useModals();

  const form = useFormContext<IPostForm>();

  const business_type = form.watch('business_type');
  const businessTypeControl = {
    onSelect: (option: A) => {
      console.log('onSelect', option);
      form.setValue('business_type', option.value);
    },
    options: businessTypeOptions,
    modalOptions: { title: 'Nhu cầu của bạn là (*)' },
    value: business_type,
  };

  const category_type = form.watch('category_type');
  const categoryTypeControl = {
    onSelect: (option: A) => {
      console.log('onSelect', option);
      form.setValue('category_type', option.value);
    },
    options: categoryTypeOptions,
    modalOptions: { title: 'Loại BĐS (*)' },
    value: category_type,
  };

  const full_address = form.watch('full_address');
  const onChangedFullAddress = (newAddress: string) => {
    console.log('newAddress', newAddress);
    form.setValue('full_address', newAddress);
  };

  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${full_address}&output=embed`;
  }, [full_address]);

  const city_id = form.watch('city_id');
  const district_id = form.watch('district_id');
  const ward_id = form.watch('ward_id');
  const street_id = form.watch('street_id');

  const price_in_vnd = form.watch('price_in_vnd');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    console.log('field', field, value);
    field.onChange(value); // Update the value only if it matches the regex
  };

  return (
    <div className="grid items-start gap-0 lg:col-span-3">
      <CardTitle className="text-md flex gap-2 px-0 pb-2 text-2xl font-semibold text-gray-900">
        Loại giao dịch
      </CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItemBtsPicker {...businessTypeControl} />
        <ListItemBtsPicker {...categoryTypeControl} dividers={false} />
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Hình ảnh, Video</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 pt-4">
        <InputYoutube form={form} />
        <UploadImages form={form} />
      </List>

      <CardTitle className="text-md flex gap-2 px-4 pb-2">Địa chỉ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <LocationsPicker
          openModal={openModal}
          city={{ text: '', value: city_id }}
          district={{ text: '', value: district_id }}
          ward={{ text: '', value: ward_id }}
          street={{ text: '', value: street_id }}
          onChangeCity={(city) => {
            form.setValue('city_id', city?.value);
            closeModal();
          }}
          onChangeDistrict={(district) => {
            form.setValue('district_id', district?.value);
            closeModal();
          }}
          onChangeWard={(ward) => {
            form.setValue('ward_id', ward?.value);
            closeModal();
          }}
          onChangeStreet={(street) => {
            form.setValue('street_id', street?.value);
            closeModal();
          }}
          withStreet={true}
          onChangedFullAddress={onChangedFullAddress}
        />
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Bản đồ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <div className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Label className="whitespace-nowrap">Địa chỉ:</Label>
            <Input placeholder="Nhập địa chỉ" {...form.register('full_address')} />
          </div>
          <br />
          <Label>Vị trí trên bản đồ</Label>

          <iframe
            className="min-h-64 w-full"
            style={{ border: 0 }}
            loading="lazy"
            src={mapSrc}
          ></iframe>
        </div>
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Nội dung mô tả</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 py-4">
        <InputTitle form={form} />
        <InputDescription form={form} />
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Thông tin bất động sản</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem className={styles.rowItemInput}>
              <FormLabel className="whitespace-nowrap">
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
        <ListItemBtsPicker
          options={phapLyTypeOptions}
          modalOptions={{ title: 'Giấy tờ pháp lý' }}
          value={form.watch('phap_ly')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('phap_ly', option.value);
          }}
        />

        <FormField
          control={form.control}
          name="price_in_vnd"
          render={({ field }) => (
            <ListItemPickCustomUI
              modalOptions={{ title: 'Giá bán/ thuê (VNĐ)' }}
              trigger={
                <FormItem className="grid gap-2 border-b pb-2">
                  <div className={twMerge(styles.rowItemInput, 'justify-between border-b-0 pb-0')}>
                    <FormLabel className="w-3/5">
                      <span className="text-red-600">*</span> Giá bán/ thuê (VNĐ)
                    </FormLabel>
                    <div className="text-right">
                      {field.value !== 'Thỏa thuận' ? readMoney(field.value) : field.value}
                    </div>
                  </div>
                </FormItem>
              }
              content={({ isOpen, setIsOpen }) => (
                <div className="flex flex-col gap-4">
                  <PriceAutoCompleteListView
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
                    onCompleted={() => setIsOpen(false)}
                  />
                  <div className="flex w-full items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={form.getValues('price_in_vnd') === 'Thỏa thuận'}
                      onCheckedChange={(value) => {
                        if (value) {
                          form.setValue('price_in_vnd', 'Thỏa thuận');
                        } else {
                          form.setValue('price_in_vnd', '');
                        }
                        setIsOpen(false); // Close when selected
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
              )}
            />
          )}
        />

        <FormField
          control={form.control}
          name="bedrooms_count"
          render={({ field }) => (
            <FormItem>
              <ListItemBtsPicker
                onSelect={(option: A) => {
                  console.log('onSelect bedrooms_count', option);
                  field.onChange(option.value);
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                options={roomsOptionsForCreate}
                value={field.value}
                modalOptions={{ title: 'Phòng ngủ', maxHeightPercent: 0.7 }}
                formattedValue={field.value ? `${field.value} PN` : ''}
                footer={
                  <div className="flex flex-col gap-4 p-4">
                    <Label>Số khác:</Label>
                    <RoundedOptionsNumberInput
                      {...field}
                      className="relative"
                      placeholder="Nhập số"
                      onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                      maxLength={3}
                      hiddenSelect
                    />
                    <Button variant="default" className="w-full" onClick={closeModal}>
                      OK
                    </Button>
                  </div>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bathrooms_count"
          render={({ field }) => (
            <FormItem>
              <ListItemBtsPicker
                onSelect={(option: A) => {
                  console.log('onSelect bathrooms_count', option);
                  field.onChange(option.value);
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                options={roomsOptionsForCreate}
                value={field.value}
                modalOptions={{ title: 'Phòng tắm', maxHeightPercent: 0.7 }}
                formattedValue={field.value ? `${field.value} WC` : ''}
                footer={
                  <div className="flex flex-col gap-4 p-4">
                    <Label>Số khác:</Label>
                    <RoundedOptionsNumberInput
                      {...field}
                      className="relative"
                      placeholder="Nhập số"
                      onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                      maxLength={3}
                      hiddenSelect
                    />
                    <Button variant="default" className="w-full" onClick={closeModal}>
                      OK
                    </Button>
                  </div>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facade"
          render={({ field }) => (
            <FormItem>
              <ListItemBtsPicker
                onSelect={(option: A) => {
                  console.log('onSelect facade', option);
                  field.onChange(option.value);
                }}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                options={facadeOptionsForCreate}
                value={field.value}
                modalOptions={{ title: 'Mặt tiền', maxHeightPercent: 0.7 }}
                formattedValue={field.value ? `${field.value} m` : ''}
                footer={
                  <div className="flex flex-col gap-4 p-4">
                    <Label>Số khác:</Label>
                    <RoundedOptionsNumberInput
                      {...field}
                      className="relative"
                      placeholder="Nhập số"
                      onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                      maxLength={3}
                      hiddenSelect
                    />
                    <Button variant="default" className="w-full" onClick={closeModal}>
                      OK
                    </Button>
                  </div>
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <ListItemBtsPicker
          options={directionOptions}
          modalOptions={{ title: 'Hướng nhà/ đất' }}
          value={form.watch('entrance_direction')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('entrance_direction', option.value);
          }}
        />

        <ListItemBtsPicker
          options={directionOptions}
          modalOptions={{ title: 'Hướng ban công' }}
          value={form.watch('view_direction')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('view_direction', option.value);
          }}
        />

        <ListItemBtsPicker
          options={furnitureTypeOptions}
          modalOptions={{ title: 'Nội thất' }}
          value={form.watch('furniture')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('furniture', option.value);
          }}
          dividers={false}
        />
        {/* <TestComponents /> */}
      </List>
    </div>
  );
};

const styles = {
  rowItemInput: 'flex items-center justify-center gap-4 ml-4 pr-4 border-b pb-2 pt-2',
} as const;
