'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ControllerRenderProps, useForm, useFormContext } from 'react-hook-form';
import ProductInfoForm from './components/form-components/product-info-form';
import { businessTypeOptions, categoryTypeOptions } from './constant';

import { Form, FormField } from '@/components/ui/form';
import List from '@components/konsta/List';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { useIsMobile } from '@hooks';
import ListItemBtsPicker from '@mobile/bts-pickers/ListItemBtsPicker';
import TestComponents from '@mobile/home/TestComponents';
import useModals from '@mobile/modals/hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { IPostForm } from '../types';
import ProductApiService from './apis/product-api';
import ImageForm from './components/form-components/image-form';
import LocationFormV2 from './components/form-components/location-form-v2';
import ProductDescriptionForm from './components/form-components/product-description';
import ProductTypeForm from './components/form-components/product-type';
import { PostFormSchema } from './form-schemas';

import { CardTitle } from '@components/ui/card';
import { BadgeInfo } from 'lucide-react';

import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectSeparator } from '@/components/ui/select';
import { buildOptionsPrice, maskNumber } from '@common/priceHelpers';
import { Checkbox } from '@components/ui/checkbox';
import React from 'react';
import { directionOptions, furnitureTypeOptions, phapLyTypeOptions } from './constant';
import { CommonSelect } from './components/CommonSelect';
import { PriceAutoComplete } from './components/form-components/fields/price-autocomplete';
import { RoundedOptionsNumberInput } from './components/form-components/fields/rounded-options-number-input';
import LocationsPicker from '@mobile/ui/LocationsPicker';
import { Label } from '@components/ui/label';

const defaultValues: IPostForm = {
  description: '',
  business_type: businessTypeOptions[0].value ?? '',
  category_type: categoryTypeOptions[0].value ?? '',
  title: '',
  area: '',
  phap_ly: '',
  price_in_vnd: '',
  city_id: 1,
  district_id: 55,
  ward_id: undefined,
  street_id: undefined,
  project_id: '',
  full_address: '',
  bedrooms_count: '5',
  bathrooms_count: '3',
  facade: '',
  entrance: '',
  floors_count: '',
  entrance_direction: '',
  view_direction: '',
  furniture: '',
  image_ids: '',
  youtube_url: '',
} as const;

const NewPost: React.FC = () => {
  const isMobile = useIsMobile();

  const form = useForm<IPostForm>({
    // @ts-expect-error: ok
    resolver: yupResolver(PostFormSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  const onSubmit = async () => {
    try {
      const params = form.getValues();
      const res = await ProductApiService.Create(params);
      console.log('resssssssss', res);

      if (res.status) {
        toast.success('Đăng tin thành công');
        setTimeout(() => {
          window.location.href = '/dashboard/manage-post/collection-post';
        }, 1500);
      } else {
        // @ts-ignore: ok
        toast.error(res.message || 'Đăng tin không thành công');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      console.log('done');
    }
  };

  console.log({ errors: form.formState.errors, values: form.watch() });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="items-start gap-6 rounded-lg md:grid lg:grid-cols-3">
          {isMobile ? (
            <FormMobile />
          ) : (
            <div className="grid items-start gap-6 lg:col-span-3">
              <ImageForm form={form} />
              <ProductTypeForm form={form} />
              <LocationFormV2 form={form} />
              <ProductDescriptionForm form={form} />
              <ProductInfoForm form={form} />
            </div>
          )}
          {/* <div className="grid items-start gap-6 lg:col-span-1 top-2 sticky">
            <ProductConfigForm />
          </div> */}
        </div>
        <div className="sticky bottom-2 z-[40] mt-6 flex justify-between rounded-lg border bg-card p-3">
          <Link href={`/dashboard/manage-post/collection-post`}>
            <Button type="button" variant="ghost">
              Trở lại
            </Button>
          </Link>
          <Button type="submit">Đăng tin và thanh toán</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPost;

const FormMobile: React.FC = () => {
  const { openModal, closeModal } = useModals();

  const form = useFormContext<IPostForm>();

  const business_type = form.watch('business_type');
  const businessTypeControl = {
    onSelect: (option: A) => {
      console.log('onSelect', option);
      form.setValue('business_type', option.value);
    },
    options: businessTypeOptions,
    btsTitle: 'Nhu cầu của bạn là (*)',
    value: business_type,
  };

  const category_type = form.watch('category_type');
  const categoryTypeControl = {
    onSelect: (option: A) => {
      console.log('onSelect', option);
      form.setValue('category_type', option.value);
    },
    options: categoryTypeOptions,
    btsTitle: 'Loại BĐS (*)',
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
    // Regular expression to allow only numbers, with one optional comma or period, not at the beginning
    const regex = /^(?![.,])\d+([.,]\d{0,})?$/;

    if (regex.test(value) || value === '') {
      field.onChange(value); // Update the value only if it matches the regex
    }
  };

  return (
    <div className="grid items-start gap-4 lg:col-span-3">
      <List strongIos outlineIos>
        <CardTitle className="text-md flex gap-2 px-4 pt-4">Loại giao dịch</CardTitle>
        <ListItemBtsPicker {...businessTypeControl} />
        <ListItemBtsPicker {...categoryTypeControl} />
      </List>
      <ImageForm form={form} />

      <List strongIos outlineIos>
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
        <div className="p-4">
          <Label>Địa chỉ:</Label>
          <Input placeholder="Nhập địa chỉ" {...form.register('full_address')} />
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
      <ProductDescriptionForm form={form} />

      <List strongIos outlineIos>
        <CardTitle className="text-md flex gap-2 px-4 pt-4">Thông tin bất động sản</CardTitle>
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
          </div>
          <ListItemBtsPicker
            options={[{ text: 'Không xác định', value: '__default' }, ...phapLyTypeOptions]}
            btsTitle="Giấy tờ pháp lý"
            value={form.watch('phap_ly')}
            onSelect={(option) => {
              if (typeof option.value === 'string') form.setValue('phap_ly', option.value);
            }}
          />

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

          <ListItemBtsPicker
            options={[{ text: 'Không xác định', value: '__default' }, ...directionOptions]}
            btsTitle="Hướng nhà/ đất"
            value={form.watch('entrance_direction')}
            onSelect={(option) => {
              if (typeof option.value === 'string')
                form.setValue('entrance_direction', option.value);
            }}
          />

          <ListItemBtsPicker
            options={[{ text: 'Không xác định', value: '__default' }, ...directionOptions]}
            btsTitle="Hướng ban công"
            value={form.watch('view_direction')}
            onSelect={(option) => {
              if (typeof option.value === 'string') form.setValue('view_direction', option.value);
            }}
          />

          <ListItemBtsPicker
            options={[{ text: 'Không xác định', value: '__default' }, ...furnitureTypeOptions]}
            btsTitle="Nội thất"
            value={form.watch('furniture')}
            onSelect={(option) => {
              if (typeof option.value === 'string') form.setValue('furniture', option.value);
            }}
          />
        </div>
      </List>

      {/* <LocationFormV2 form={form} />
      <ProductDescriptionForm form={form} />
      <ProductInfoForm form={form} /> */}

      {/* <TestComponents /> */}
    </div>
  );
};
