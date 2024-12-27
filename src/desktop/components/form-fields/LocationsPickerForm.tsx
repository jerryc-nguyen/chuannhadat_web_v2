'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

import { useEffect, useMemo, useState } from 'react';
import { AutoComplete } from '@components/autocomplete';
import { LoadingSpinner } from '@components/icons/loading-spinner';
import { OptionForSelect } from '@models';
import {
  citiesData,
  cityDistrictsData,
  districtsStreetsData,
  districtsWardsData,
} from '@desktop/dashboard/main-manage-post/manage-post/constant';

interface ILocationForm {
  form: UseFormReturn<A>;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  street?: OptionForSelect;
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
  onChangeStreet: (street?: OptionForSelect) => void;
}

const LocationsPickerForm: React.FC<ILocationForm> = ({
  form,
  onChangeCity,
  onChangeDistrict,
  onChangeWard,
  onChangeStreet,
}) => {
  const { city_id, district_id } = form.getValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('isLoading', isLoading);
  }, [isLoading]);

  const citiesOptions = useMemo(() => {
    return citiesData.map((item) => {
      return {
        value: item.value.toString(),
        label: item.text,
      };
    });
  }, []);

  const districtsOptions = useMemo(() => {
    return city_id
      ? cityDistrictsData[city_id.toString()]?.map((item) => {
          return {
            value: item.value.toString(),
            label: item.text,
          };
        }) || []
      : [];
  }, [city_id]);

  const wardOptions = useMemo(() => {
    return district_id
      ? districtsWardsData[district_id.toString()]?.map((item) => {
          return {
            value: item.value ? item.value.toString() : item.id ? item.id.toString() : '',
            label: item.text,
          };
        }) || []
      : [];
  }, [district_id]);

  const streetOptions = useMemo(() => {
    return district_id
      ? districtsStreetsData[district_id.toString()]?.map((item) => {
          return {
            value: item.value ? item.value.toString() : item.id ? item.id.toString() : '',
            label: item.text,
          };
        }) || []
      : [];
  }, [district_id]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="city_id"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>
              <span className="text-red-600">*</span> Tỉnh/ Thành phố
            </FormLabel>
            <AutoComplete
              selectedValue={city_id}
              onSelectedValueChange={(value) => {
                field.onChange(value?.value || '');
                onChangeCity({ value: value?.value, text: value?.label || '' });
              }}
              items={citiesOptions}
              placeholder={'Chọn Tỉnh/ Thành phố'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoading}
              endAdornment={isLoading ? <LoadingSpinner /> : null}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="district_id"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>
              <span className="text-red-600">*</span> Quận/ Huyện
            </FormLabel>
            <AutoComplete
              selectedValue={field.value}
              onSelectedValueChange={(value) => {
                field.onChange(value?.value || '');
                onChangeDistrict({ value: value?.value, text: value?.label || '' });
              }}
              items={districtsOptions}
              placeholder={'Chọn Quận/ Huyện'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoading || !city_id}
              endAdornment={isLoading ? <LoadingSpinner /> : null}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ward_id"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>Phường/ Xã</FormLabel>
            <AutoComplete
              selectedValue={field.value || ''}
              onSelectedValueChange={(value) => {
                field.onChange(value?.value || '');
                onChangeWard({ value: value?.value, text: value?.label || '' });
              }}
              items={wardOptions}
              placeholder={'Chọn Phường/ Xã'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoading || !district_id}
              endAdornment={isLoading ? <LoadingSpinner /> : null}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="street_id"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            <FormLabel>Đường/ Phố</FormLabel>
            <AutoComplete
              selectedValue={field.value || ''}
              onSelectedValueChange={(value) => {
                field.onChange(value?.value || '');
                onChangeStreet({ value: value?.value, text: value?.label || '' });
              }}
              items={streetOptions}
              placeholder={'Chọn Đường/ Phố'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoading || !district_id}
              endAdornment={isLoading ? <LoadingSpinner /> : null}
            />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationsPickerForm;
