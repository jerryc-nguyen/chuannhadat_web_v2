'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { AutoComplete } from '@components/autocomplete';
import { LoadingSpinner } from '@components/icons/CustomIcons';
import { OptionForSelect } from '@common/types';
import { useLocationContext } from '@contexts/LocationContext';

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

  // Use LocationContext for data and loading states
  const {
    cities,
    citiesDistricts,
    districtWards,
    districtStreets,
    isLoadingCities,
    isLoadingDistricts,
    isLoadingWards,
    isLoadingStreets,
    loadCities,
    loadDistricts,
    loadWards,
    loadStreets,
  } = useLocationContext();

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const citiesOptions = useMemo(() => {
    return cities.map((item: OptionForSelect) => {
      return {
        value: item.value?.toString() || '',
        label: item.text || '',
      };
    });
  }, [cities]);

  const districtsOptions = useMemo(() => {
    return city_id
      ? citiesDistricts[city_id.toString()]?.map((item: OptionForSelect) => {
        return {
          value: item.value?.toString() || '',
          label: item.text || '',
        };
      }) || []
      : [];
  }, [city_id, citiesDistricts]);

  const wardOptions = useMemo(() => {
    return district_id
      ? districtWards[district_id.toString()]?.map((item: OptionForSelect) => {
        return {
          value: item.value?.toString() || '',
          label: item.text || '',
        };
      }) || []
      : [];
  }, [district_id, districtWards]);

  const streetOptions = useMemo(() => {
    return district_id
      ? districtStreets[district_id.toString()]?.map((item: OptionForSelect) => {
        return {
          value: item.value?.toString() || '',
          label: item.text || '',
        };
      }) || []
      : [];
  }, [district_id, districtStreets]);

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
              onSelectedValueChange={async (value) => {
                field.onChange(value?.value || '');
                onChangeCity({ value: value?.value, text: value?.label || '' });

                // Load districts when city is selected
                if (value?.value) {
                  await loadDistricts(value.value);
                }
              }}
              items={citiesOptions}
              placeholder={'Chọn Tỉnh/ Thành phố'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoadingCities}
              endAdornment={isLoadingCities ? <LoadingSpinner /> : null}
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
              onSelectedValueChange={async (value) => {
                field.onChange(value?.value || '');
                onChangeDistrict({ value: value?.value, text: value?.label || '' });

                // Load wards and streets when district is selected
                if (value?.value) {
                  await Promise.all([
                    loadWards(value.value),
                    loadStreets(value.value)
                  ]);
                }
              }}
              items={districtsOptions}
              placeholder={'Chọn Quận/ Huyện'}
              emptyMessage="Không tìm thấy nội dung"
              disabled={isLoadingDistricts || !city_id}
              endAdornment={isLoadingDistricts ? <LoadingSpinner /> : null}
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
              disabled={isLoadingWards || !district_id}
              endAdornment={isLoadingWards ? <LoadingSpinner /> : null}
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
              disabled={isLoadingStreets || !district_id}
              endAdornment={isLoadingStreets ? <LoadingSpinner /> : null}
            />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationsPickerForm;
