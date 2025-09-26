'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { OptionForSelect } from '@common/types';
import LocationsPickerFormV2 from '@components/desktop/components/form-fields/LocationsPickerFormV2';
import { FormField, FormItem, FormLabel } from '@components/ui/form';
import { useWatch } from 'react-hook-form';

const LocationFormV2: React.FC<A> = ({ form }) => {
  // Check if we should show the location form
  const project = useWatch({ control: form.control, name: 'project' });
  const watchedFullAddress = useWatch({ control: form.control, name: 'full_address' });
  const shouldHideLocation = project?.value && watchedFullAddress;


  // Initialize state from form values - now using complete location objects from server
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
  const [fullAddress, setFullAddress] = useState<string>(form.getValues('full_address'));

  // Watch form values using react-hook-form's useWatch
  const watchedCity = useWatch({ control: form.control, name: 'city' });
  const watchedDistrict = useWatch({ control: form.control, name: 'district' });
  const watchedWard = useWatch({ control: form.control, name: 'ward' });
  const watchedStreet = useWatch({ control: form.control, name: 'street' });

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
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    setCurDistrict(district);
    // Update form values - set both ID and complete object
    form.setValue('district_id', district?.value || '');
    form.setValue('district', district);
  }

  const onSelectWard = (ward?: OptionForSelect) => {
    setCurWard(ward);
    // Update form values - set both ID and complete object
    form.setValue('ward_id', ward?.value || '');
    form.setValue('ward', ward);
  }

  const onSelectStreet = (street?: OptionForSelect) => {
    setCurStreet(street);
    // Update form values - set both ID and complete object
    form.setValue('street_id', street?.value || '');
    form.setValue('street', street);
  }

  const onChangedFullAddress = (address: string) => {
    setFullAddress(address);
    form.setValue('full_address', address);
  }

  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${fullAddress}&output=embed`
  }, [fullAddress])

  // Force component to rerender when props change
  const key = `${curCity?.value || ''}-${curDistrict?.value || ''}-${curWard?.value || ''}-${curStreet?.value || ''}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Khu vực bất động sản
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6">
        {!shouldHideLocation && (
          <LocationsPickerFormV2
            key={key}
            form={form}
            city={curCity}
            district={curDistrict}
            ward={curWard}
            street={curStreet}
            onChangeCity={onSelectCity}
            onChangeDistrict={onSelectDistrict}
            onChangeWard={onSelectWard}
            onChangeStreet={onSelectStreet}
            onChangedFullAddress={onChangedFullAddress}
          />
        )}

        <div className="grid gap-2">
          {!shouldHideLocation &&
            <Label htmlFor="subject">Khu vực trên bản đồ</Label>
          }

          <iframe
            className='w-full min-h-64'
            style={{ border: 0 }}
            loading="lazy"
            src={mapSrc}></iframe>
        </div>

        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="full_address"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>
                  Địa chỉ
                </FormLabel>
                <Input
                  readOnly={shouldHideLocation}
                  value={fullAddress}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                    setFullAddress(e.target.value)
                  }}
                  className="relative"
                  placeholder="Nhập địa chỉ cụ thể"
                />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationFormV2;
