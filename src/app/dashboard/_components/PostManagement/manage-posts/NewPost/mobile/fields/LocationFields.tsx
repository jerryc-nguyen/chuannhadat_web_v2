import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { OptionForSelect } from '@common/types';
import List from '@components/konsta/List';
import { CardTitle } from '@components/ui/card';
import LocationsPicker from '@components/mobile-ui/LocationsPicker';
import { IPostForm } from '@dashboard/PostManagement/types';
import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import { useLocationForm } from '@dashboard/PostManagement/hooks';
import { FormField, FormItem, FormMessage } from '@components/ui/form';

interface LocationFieldProps {
  form: UseFormReturn<IPostForm>;
  openModal: (modal: Modal) => void;
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

export default function LocationFields({
  form,
  openModal,
  closeModal,
  cityOption: initialCityOption,
  districtOption: initialDistrictOption,
  wardOption: initialWardOption,
  streetOption: initialStreetOption,
  onLocationChange
}: LocationFieldProps) {
  // Use the custom hook for location form logic
  const {
    curCity,
    curDistrict,
    curWard,
    curStreet,
    onSelectCity: hookOnSelectCity,
    onSelectDistrict: hookOnSelectDistrict,
    onSelectWard: hookOnSelectWard,
    onSelectStreet: hookOnSelectStreet,
    onChangedFullAddress,
    locationKey: _locationKey
  } = useLocationForm({ form, onLocationChange });

  // Track location state - prioritize complete objects from hook, then fallback to props
  const [cityOption, setCityOption] = useState<OptionForSelect | undefined>(
    curCity || initialCityOption
  );
  const [districtOption, setDistrictOption] = useState<OptionForSelect | undefined>(
    curDistrict || initialDistrictOption
  );
  const [wardOption, setWardOption] = useState<OptionForSelect | undefined>(
    curWard || initialWardOption
  );
  const [streetOption, setStreetOption] = useState<OptionForSelect | undefined>(
    curStreet || initialStreetOption
  );

  // Create a key for LocationsPicker to force rebuild - use the hook's key
  const [locationPickerKey, setLocationPickerKey] = useState(0);

  // Also watch for changes in location IDs for backward compatibility
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

  // Update component state when hook values change
  useEffect(() => {
    if (curCity) setCityOption(curCity);
  }, [curCity]);

  useEffect(() => {
    if (curDistrict) setDistrictOption(curDistrict);
  }, [curDistrict]);

  useEffect(() => {
    if (curWard) setWardOption(curWard);
  }, [curWard]);

  useEffect(() => {
    if (curStreet) setStreetOption(curStreet);
  }, [curStreet]);

  // Update local state when props change
  useEffect(() => {
    if (initialCityOption) setCityOption(initialCityOption);
    if (initialDistrictOption) setDistrictOption(initialDistrictOption);
    if (initialWardOption) setWardOption(initialWardOption);
    if (initialStreetOption) setStreetOption(initialStreetOption);
  }, [initialCityOption, initialDistrictOption, initialWardOption, initialStreetOption]);

  // Mobile-specific handlers that wrap the hook handlers with closeModal
  const handleChangeCity = (city: OptionForSelect | undefined) => {
    hookOnSelectCity(city);
    setCityOption(city);
    setDistrictOption(undefined);
    setWardOption(undefined);
    setStreetOption(undefined);
    closeModal();
  };

  const handleChangeDistrict = (district: OptionForSelect | undefined) => {
    hookOnSelectDistrict(district);
    setDistrictOption(district);
    setWardOption(undefined);
    setStreetOption(undefined);
    closeModal();
  };

  const handleChangeWard = (ward: OptionForSelect | undefined) => {
    hookOnSelectWard(ward);
    setWardOption(ward);
    setStreetOption(undefined);
    closeModal();
  };

  const handleChangeStreet = (street: OptionForSelect | undefined) => {
    hookOnSelectStreet(street);
    setStreetOption(street);
    closeModal();
  };

  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Địa chỉ</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg pb-4">
        {/* Invisible anchors for invalid-submit scrolling */}
        <div data-field-name="city_id" className="h-0" />
        <div data-field-name="district_id" className="h-0" />
        <div data-field-name="ward_id" className="h-0" />
        <div data-field-name="street_id" className="h-0" />
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

        {/* Inline error messages for required location fields */}
        <FormField
          control={form.control}
          name="city_id"
          render={() => (
            <FormItem data-field-name="city_id" className="px-4">
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district_id"
          render={() => (
            <FormItem data-field-name="district_id" className="px-4">
              <FormMessage />
            </FormItem>
          )}
        />
      </List>
    </>
  );
}
