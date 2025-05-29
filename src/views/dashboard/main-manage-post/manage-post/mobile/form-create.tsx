'use client';

import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import List from '@components/konsta/List';
import ListItemBtsPicker from '@mobile/bts-pickers/ListItemBtsPicker';
import useModals from '@mobile/modals/hooks';

import { CardTitle } from '@components/ui/card';

import { FormItem, FormMessage } from '@/components/ui/form';
import { readMoney } from '@common/priceHelpers';
import { Label } from '@components/ui/label';
import LocationsPicker from '@mobile/ui/LocationsPicker';
import React, { useState, useEffect } from 'react';

import {
  businessTypeOptions,
  categoryTypeOptions,
  directionOptions,
  furnitureTypeOptions,
  phapLyTypeOptions,
} from '../constant';
import { IPostForm } from '../../types';
import { InputYoutube, UploadImages } from '../components/form-components/image-form';
import { InputDescription, InputTitle } from '../components/form-components/product-description';

import { RoundedOptionsNumberInput } from '../components/form-components/fields/rounded-options-number-input';
import {
  roomsOptionsForCreate,
  facadeOptionsForCreate,
  areaOptionsForCreate,
} from '@mobile/filter_bds/constants';
import { Button } from '@components/ui/button';
import { OptionForSelect } from '@models';
import PriceOptions from './PriceOptions';
import ListItem from '@components/konsta/ListItem';
import { ChevronRightIcon } from 'lucide-react';
import ProjectPicker from '@components/ajax-pickers/ProjectPicker';

/**
 * TODO: Split file to smaller components
 * TODO: Refactor code
 */

export const FormMobile: React.FC = () => {
  const { openModal, closeModal } = useModals();

  const form = useFormContext<IPostForm>();
  const [curProject, setCurProject] = useState<OptionForSelect | undefined>(
    form.watch('project_id') ? { value: form.watch('project_id'), text: "" } : undefined
  );

  // Track location state
  const [cityOption, setCityOption] = useState<OptionForSelect | undefined>();
  const [districtOption, setDistrictOption] = useState<OptionForSelect | undefined>();
  const [wardOption, setWardOption] = useState<OptionForSelect | undefined>();
  const [streetOption, setStreetOption] = useState<OptionForSelect | undefined>();

  // Create a key for LocationsPicker to force rebuild
  const [locationPickerKey, setLocationPickerKey] = useState(0);

  const business_type = form.watch('business_type');
  const category_type = form.watch('category_type');

  // Watch for changes in location IDs
  const city_id = form.watch('city_id');
  const district_id = form.watch('district_id');
  const ward_id = form.watch('ward_id');
  const street_id = form.watch('street_id');

  // Update locationPickerKey when any location ID changes
  useEffect(() => {
    setLocationPickerKey(prev => prev + 1);

    // Reset the options when IDs change to ensure proper display
    if (city_id && !cityOption?.value) {
      setCityOption({ value: city_id, text: '' });
    }

    if (district_id && !districtOption?.value) {
      setDistrictOption({ value: district_id, text: '' });
    }

    if (ward_id && !wardOption?.value) {
      setWardOption({ value: ward_id, text: '' });
    }

    if (street_id && !streetOption?.value) {
      setStreetOption({ value: street_id, text: '' });
    }
  }, [city_id, district_id, ward_id, street_id]);

  // Check if it's land or land project
  const isLand = category_type === 'dat' || category_type === 'dat_nen_du_an';

  // Check if it's a house
  const isHouse = category_type === 'nha_rieng' ||
    category_type === 'nha_mat_pho' ||
    category_type === 'biet_thu_lien_ke' ||
    category_type === 'nha_tro_phong_tro' ||
    category_type === 'van_phong' ||
    category_type === 'cua_hang_kiot';

  // Check if it's an apartment
  const isApartment = category_type === 'can_ho_chung_cu';

  const businessTypeControl = {
    onSelect: (option: A) => {
      console.log('onSelect', option);
      form.setValue('business_type', option.value);
    },
    options: businessTypeOptions,
    modalOptions: { title: 'Nhu cầu (*)' },
    value: business_type,
  };

  const categoryTypeControl = {
    onSelect: (option: A) => {
      form.setValue('category_type', option.value);
    },
    options: categoryTypeOptions,
    modalOptions: { title: 'Loại BĐS (*)' },
    value: category_type,
  };

  const onChangedFullAddress = (newAddress: string) => {
    form.setValue('full_address', newAddress);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    // console.log('field', field, value);
    field.onChange(value); // Update the value only if it matches the regex
  };

  const handleSelectProject = (option: OptionForSelect) => {
    closeModal();
    setCurProject(option);
    // Set project values in form
    if (option.value !== undefined) {
      form.setValue('project_id', option.value);
    }
    // Set additional data if available
    if (option.data) {
      // Update form values
      form.setValue('city_id', option.data?.city_id || '');
      form.setValue('district_id', option.data?.district_id || '');
      form.setValue('ward_id', option.data?.ward_id || '');
      form.setValue('street_id', option.data?.street_id || '');
      form.setValue('full_address', option.data?.address || '');

      // Update location options for display
      if (option.data?.city_id) {
        setCityOption({ value: option.data.city_id, text: option.data.city_name || '' });
      }

      if (option.data?.district_id) {
        setDistrictOption({ value: option.data.district_id, text: option.data.district_name || '' });
      }

      if (option.data?.ward_id) {
        setWardOption({ value: option.data.ward_id, text: option.data.ward_name || '' });
      }

      if (option.data?.street_id) {
        setStreetOption({ value: option.data.street_id, text: option.data.street_name || '' });
      }
    }
  };

  const handleClearProject = () => {
    setCurProject(undefined);
    form.setValue('project_id', '');
  };

  const handleChangeCity = (city: OptionForSelect | undefined) => {
    setCityOption(city);
    form.setValue('city_id', city?.value || '');
    // Clear dependent fields
    setDistrictOption(undefined);
    setWardOption(undefined);
    setStreetOption(undefined);
    form.setValue('district_id', '');
    form.setValue('ward_id', '');
    form.setValue('street_id', '');
    closeModal();
  };

  const handleChangeDistrict = (district: OptionForSelect | undefined) => {
    setDistrictOption(district);
    form.setValue('district_id', district?.value || '');
    // Clear dependent fields
    setWardOption(undefined);
    setStreetOption(undefined);
    form.setValue('ward_id', '');
    form.setValue('street_id', '');
    closeModal();
  };

  const handleChangeWard = (ward: OptionForSelect | undefined) => {
    setWardOption(ward);
    form.setValue('ward_id', ward?.value || '');
    // Clear dependent fields
    setStreetOption(undefined);
    form.setValue('street_id', '');
    closeModal();
  };

  const handleChangeStreet = (street: OptionForSelect | undefined) => {
    setStreetOption(street);
    form.setValue('street_id', street?.value || '');
    closeModal();
  };

  return (
    <div className="grid items-start gap-0 lg:col-span-3">
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Thông tin cơ bản</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItemBtsPicker {...businessTypeControl} />
        <ListItemBtsPicker {...categoryTypeControl} dividers={true} />

        <FormField
          control={form.control}
          name="price_in_vnd"
          render={({ field }) => (
            <ListItem
              link
              title={'Giá'}
              value={field.value}
              onClear={() => {
                field.onChange('');
              }}
              onClick={() => {
                openModal({
                  name: `ListItemBtsPicker_price`,
                  title: 'Giá',
                  content: (
                    <PriceOptions
                      value={form.getValues('price_in_vnd')}
                      onSelect={(option: OptionForSelect) => {
                        onChangeFieldNumber(field, option.value + '');
                        closeModal();
                      }}
                      businessType={form.getValues('business_type')}
                    />
                  ),
                });
              }}
              after={readMoney(form.getValues('price_in_vnd'))}
              dividers={true}
            />
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <ListItemBtsPicker
                onSelect={(option: A) => {
                  field.onChange(option.value);
                }}
                options={areaOptionsForCreate}
                value={field.value}
                modalOptions={{ title: 'Diện tích', maxHeightPercent: 0.7 }}
                formattedValue={field.value ? `${field.value} m²` : ''}
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

        {/* Only show bedroom fields if not land */}
        {!isLand && (
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
        )}

        {/* Only show bathroom fields if not land */}
        {!isLand && (
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
        )}
      </List>

      <CardTitle className="text-md flex gap-2 px-4 pb-2">Địa chỉ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItem
          link
          title="Dự án"
          after={curProject?.text}
          value={curProject?.value}
          onClear={handleClearProject}
          onClick={() => {
            openModal({
              name: 'project',
              title: 'Dự án',
              content: (
                <ProjectPicker
                  value={curProject}
                  onSelect={handleSelectProject}
                  extraParams={{ scope: 'dashboard' }}
                />
              ),
              maxHeightPercent: 0.6,
            });
          }}
        />
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Địa chỉ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <LocationsPicker
          key={locationPickerKey}
          openModal={openModal}
          city={cityOption}
          district={districtOption}
          ward={wardOption}
          street={streetOption}
          onChangeCity={handleChangeCity}
          onChangeDistrict={handleChangeDistrict}
          onChangeWard={handleChangeWard}
          onChangeStreet={handleChangeStreet}
          withStreet={true}
          onChangedFullAddress={onChangedFullAddress}
        />
      </List>

      <CardTitle className="text-md flex gap-2 px-4 pb-2">Nội dung mô tả</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 py-4">
        <InputTitle form={form} />
        <InputDescription form={form} />
      </List>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Thông tin chi tiết</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItemBtsPicker
          options={phapLyTypeOptions}
          modalOptions={{ title: 'Giấy tờ pháp lý' }}
          value={form.watch('phap_ly')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('phap_ly', option.value);
          }}
          footer={
            <div className="px-4 pt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  form.setValue('phap_ly', '');
                  closeModal();
                }}
                disabled={!form.watch('phap_ly')}
              >
                Xóa
              </Button>
            </div>
          }
        />

        {/* Mặt tiền - Hide for apartment */}
        {!isApartment && (
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
                  options={facadeOptionsForCreate}
                  value={field.value}
                  modalOptions={{ title: isHouse ? 'Mặt tiền rộng (m)' : 'Chiều ngang đất rộng (m)', maxHeightPercent: 0.7 }}
                  formattedValue={field.value ? `${field.value} m` : ''}
                  footer={
                    <>
                      <div className="px-4 pt-4">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            field.onChange('');
                            closeModal();
                          }}
                          disabled={!field.value}
                        >
                          Xóa
                        </Button>
                      </div>
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
                    </>
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Số tầng / Vị trí tầng - Hide for land */}
        {!isLand && (
          <ListItemBtsPicker
            options={roomsOptionsForCreate}
            modalOptions={{ title: isApartment ? 'Vị trí tầng' : 'Số tầng' }}
            value={form.watch('floors_count')}
            onSelect={(option) => {
              form.setValue('floors_count', option.value?.toString() ?? '');
            }}
            formattedValue={form.watch('floors_count') ? `${form.watch('floors_count')} tầng` : ''}
            footer={
              <>
                <div className="px-4 pt-4">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      form.setValue('floors_count', '');
                      closeModal();
                    }}
                    disabled={!form.watch('floors_count')}
                  >
                    Xóa
                  </Button>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  <Label>Số khác:</Label>
                  <RoundedOptionsNumberInput
                    value={form.watch('floors_count')}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => form.setValue('floors_count', e.target.value)}
                    maxLength={3}
                    hiddenSelect
                  />
                  <Button variant="default" className="w-full" onClick={closeModal}>
                    OK
                  </Button>
                </div>
              </>
            }
          />
        )}

        <ListItemBtsPicker
          options={directionOptions}
          modalOptions={{ title: isApartment ? 'Hướng ban công' : 'Hướng nhà/ đất' }}
          value={form.watch('entrance_direction')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('entrance_direction', option.value);
          }}
          footer={
            <div className="px-4 pt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  form.setValue('entrance_direction', '');
                  closeModal();
                }}
                disabled={!form.watch('entrance_direction')}
              >
                Xóa
              </Button>
            </div>
          }
        />

        {/* Nội thất - Show for house or apartment */}
        {(isHouse || isApartment) && (
          <ListItemBtsPicker
            options={furnitureTypeOptions}
            modalOptions={{ title: 'Nội thất' }}
            value={form.watch('furniture')}
            onSelect={(option) => {
              if (typeof option.value === 'string') form.setValue('furniture', option.value);
            }}
            dividers={false}
            footer={
              <div className="px-4 pt-4">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    form.setValue('furniture', '');
                    closeModal();
                  }}
                  disabled={!form.watch('furniture')}
                >
                  Xóa
                </Button>
              </div>
            }
          />
        )}
      </List>

      <CardTitle className="text-md flex gap-2 px-4 pb-2">Hình ảnh, Video</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg px-4 pt-4">
        <InputYoutube form={form} />
        <UploadImages form={form} />
      </List>
    </div>
  );
};
