import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OptionForSelect } from '@common/types';
import List from '@components/konsta/List';
import { CardTitle } from '@components/ui/card';
import LocationsPicker from '@components/mobile-ui/LocationsPicker';
import { IPostForm } from '@dashboard/PostManagement/types';

interface LocationFieldProps {
  form: UseFormReturn<IPostForm>;
  openModal: (params: any) => void;
  closeModal: () => void;
  cityOption?: OptionForSelect;
  districtOption?: OptionForSelect;
  wardOption?: OptionForSelect;
  streetOption?: OptionForSelect;
  onLocationChange: (options: {
    city?: OptionForSelect | undefined;
    district?: OptionForSelect | undefined;
    ward?: OptionForSelect | undefined;
    street?: OptionForSelect | undefined;
  }) => void;
}

export default function LocationField({
  form,
  openModal,
  closeModal,
  cityOption: initialCityOption,
  districtOption: initialDistrictOption,
  wardOption: initialWardOption,
  streetOption: initialStreetOption,
  onLocationChange
}: LocationFieldProps) {
  // Track location state
  const [cityOption, setCityOption] = useState<OptionForSelect | undefined>(initialCityOption);
  const [districtOption, setDistrictOption] = useState<OptionForSelect | undefined>(initialDistrictOption);
  const [wardOption, setWardOption] = useState<OptionForSelect | undefined>(initialWardOption);
  const [streetOption, setStreetOption] = useState<OptionForSelect | undefined>(initialStreetOption);

  // Create a key for LocationsPicker to force rebuild
  const [locationPickerKey, setLocationPickerKey] = useState(0);

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
  }, [city_id, district_id, ward_id, street_id, cityOption?.value, districtOption?.value, wardOption?.value, streetOption?.value]);

  // Update local state when props change
  useEffect(() => {
    if (initialCityOption) setCityOption(initialCityOption);
    if (initialDistrictOption) setDistrictOption(initialDistrictOption);
    if (initialWardOption) setWardOption(initialWardOption);
    if (initialStreetOption) setStreetOption(initialStreetOption);
  }, [initialCityOption, initialDistrictOption, initialWardOption, initialStreetOption]);

  const onChangedFullAddress = (newAddress: string) => {
    form.setValue('full_address', newAddress);
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

    onLocationChange({
      city,
      district: undefined,
      ward: undefined,
      street: undefined
    });
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

    onLocationChange({
      district,
      ward: undefined,
      street: undefined
    });
  };

  const handleChangeWard = (ward: OptionForSelect | undefined) => {
    setWardOption(ward);
    form.setValue('ward_id', ward?.value || '');
    // Clear dependent fields
    setStreetOption(undefined);
    form.setValue('street_id', '');
    closeModal();

    onLocationChange({
      ward,
      street: undefined
    });
  };

  const handleChangeStreet = (street: OptionForSelect | undefined) => {
    setStreetOption(street);
    form.setValue('street_id', street?.value || '');
    closeModal();

    onLocationChange({
      street
    });
  };

  return (
    <>
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
    </>
  );
} 
