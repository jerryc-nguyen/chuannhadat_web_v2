import { useState, useEffect, useMemo } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { OptionForSelect } from '@common/types';
import { IPostForm } from '@dashboard/PostManagement/types';

interface UseLocationFormProps {
  form: UseFormReturn<IPostForm>;
  onLocationChange?: (options: {
    city?: OptionForSelect | undefined;
    district?: OptionForSelect | undefined;
    ward?: OptionForSelect | undefined;
    street?: OptionForSelect | undefined;
  }) => void;
}

interface UseLocationFormReturn {
  // State values
  curCity: OptionForSelect | undefined;
  curDistrict: OptionForSelect | undefined;
  curWard: OptionForSelect | undefined;
  curStreet: OptionForSelect | undefined;
  fullAddress: string;

  // Handlers
  onSelectCity: (city?: OptionForSelect) => void;
  onSelectDistrict: (district?: OptionForSelect) => void;
  onSelectWard: (ward?: OptionForSelect) => void;
  onSelectStreet: (street?: OptionForSelect) => void;
  onChangedFullAddress: (address: string) => void;

  // Utilities
  mapSrc: string;
  locationKey: string;
}

export function useLocationForm({ form, onLocationChange }: UseLocationFormProps): UseLocationFormReturn {
  // Initialize state from form values - using complete location objects from server
  const { city, district, ward, street } = form.getValues();

  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(
    city?.value ? city : undefined
  );
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(
    district?.value ? district : undefined
  );
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(
    ward?.value ? ward : undefined
  );
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>(
    street?.value ? street : undefined
  );
  const [fullAddress, setFullAddress] = useState<string>(form.getValues('full_address') || '');

  // Watch form values using react-hook-form's useWatch
  const watchedCity = useWatch({ control: form.control, name: 'city' });
  const watchedDistrict = useWatch({ control: form.control, name: 'district' });
  const watchedWard = useWatch({ control: form.control, name: 'ward' });
  const watchedStreet = useWatch({ control: form.control, name: 'street' });
  const watchedFullAddress = useWatch({ control: form.control, name: 'full_address' });

  // Update component state when form values change
  useEffect(() => {
    if (watchedCity?.value) {
      setCurCity(watchedCity);
    }
  }, [watchedCity]);

  useEffect(() => {
    if (watchedDistrict?.value) {
      setCurDistrict(watchedDistrict);
    }
  }, [watchedDistrict]);

  useEffect(() => {
    if (watchedWard?.value) {
      setCurWard(watchedWard);
    }
  }, [watchedWard]);

  useEffect(() => {
    if (watchedStreet?.value) {
      setCurStreet(watchedStreet);
    }
  }, [watchedStreet]);

  useEffect(() => {
    if (watchedFullAddress && watchedFullAddress !== fullAddress) {
      setFullAddress(watchedFullAddress);
    }
  }, [watchedFullAddress, fullAddress]);

  const onSelectCity = (city?: OptionForSelect) => {
    setCurCity(city);
    // Update form values - set both ID and complete object
    form.setValue('city_id', city?.value || '');
    form.setValue('city', city);

    // Clear dependent fields when city changes
    setCurDistrict(undefined);
    setCurWard(undefined);
    setCurStreet(undefined);
    form.setValue('district_id', '');
    form.setValue('district', undefined);
    form.setValue('ward_id', '');
    form.setValue('ward', undefined);
    form.setValue('street_id', '');
    form.setValue('street', undefined);

    // Notify parent component if callback provided
    onLocationChange?.({
      city,
      district: undefined,
      ward: undefined,
      street: undefined
    });
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    setCurDistrict(district);
    // Update form values - set both ID and complete object
    form.setValue('district_id', district?.value || '');
    form.setValue('district', district);

    // Clear dependent fields when district changes
    setCurWard(undefined);
    setCurStreet(undefined);
    form.setValue('ward_id', '');
    form.setValue('ward', undefined);
    form.setValue('street_id', '');
    form.setValue('street', undefined);

    // Notify parent component if callback provided
    onLocationChange?.({
      district,
      ward: undefined,
      street: undefined
    });
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    setCurWard(ward);
    // Update form values - set both ID and complete object
    form.setValue('ward_id', ward?.value || '');
    form.setValue('ward', ward);

    // Clear dependent fields when ward changes
    setCurStreet(undefined);
    form.setValue('street_id', '');
    form.setValue('street', undefined);

    // Notify parent component if callback provided
    onLocationChange?.({
      ward,
      street: undefined
    });
  };

  const onSelectStreet = (street?: OptionForSelect) => {
    setCurStreet(street);
    // Update form values - set both ID and complete object
    form.setValue('street_id', street?.value || '');
    form.setValue('street', street);

    // Notify parent component if callback provided
    onLocationChange?.({
      street
    });
  };

  const onChangedFullAddress = (address: string) => {
    setFullAddress(address);
    form.setValue('full_address', address);
  };

  // Generate map source URL
  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${fullAddress}&output=embed`;
  }, [fullAddress]);

  // Generate key for component re-rendering
  const locationKey = `${curCity?.value || ''}-${curDistrict?.value || ''}-${curWard?.value || ''}-${curStreet?.value || ''}`;

  return {
    // State values
    curCity,
    curDistrict,
    curWard,
    curStreet,
    fullAddress,

    // Handlers
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onSelectStreet,
    onChangedFullAddress,

    // Utilities
    mapSrc,
    locationKey,
  };
}
