'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { OptionForSelect } from '@models';
import LocationsPickerFormV2 from '@views/components/form-fields/LocationsPickerFormV2';
import { FormField, FormItem, FormLabel } from '@components/ui/form';
import { useWatch } from 'react-hook-form';

const LocationFormV2: React.FC<A> = ({ form }) => {
  // Initialize state from form values 
  const { city_id, district_id, ward_id, street_id } = form.getValues();
  const [curCity, setCurCity] = useState<OptionForSelect | undefined>({ value: city_id, text: '' });
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>({ value: district_id, text: '' });
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>({ value: ward_id, text: '' });
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>({ value: street_id, text: '' });
  const [fullAddress, setFullAddress] = useState<string>(form.getValues('full_address'));

  // Watch form values using react-hook-form's useWatch
  const watchedCity = useWatch({ control: form.control, name: 'city_id' });
  const watchedDistrict = useWatch({ control: form.control, name: 'district_id' });
  const watchedWard = useWatch({ control: form.control, name: 'ward_id' });
  const watchedStreet = useWatch({ control: form.control, name: 'street_id' });
  const watchedFullAddress = useWatch({ control: form.control, name: 'full_address' });

  // Update component state when form values change
  useEffect(() => {
    if (watchedCity) {
      console.log('City changed in form:', watchedCity);
      setCurCity({ value: watchedCity, text: '' });
    }
  }, [watchedCity]);

  useEffect(() => {
    if (watchedDistrict) {
      console.log('District changed in form:', watchedDistrict);
      setCurDistrict({ value: watchedDistrict, text: '' });
    }
  }, [watchedDistrict]);

  useEffect(() => {
    if (watchedWard) {
      console.log('Ward changed in form:', watchedWard);
      setCurWard({ value: watchedWard, text: '' });
    }
  }, [watchedWard]);

  useEffect(() => {
    if (watchedStreet) {
      console.log('Street changed in form:', watchedStreet);
      setCurStreet({ value: watchedStreet, text: '' });
    }
  }, [watchedStreet]);

  useEffect(() => {
    if (watchedFullAddress && watchedFullAddress !== fullAddress) {
      setFullAddress(watchedFullAddress);
    }
  }, [watchedFullAddress]);

  const onSelectCity = (city?: OptionForSelect) => {
    setCurCity(city);
    // Update form values
    form.setValue('city_id', city?.value);
    form.setValue('city', city);
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    setCurDistrict(district);
    // Update form values
    form.setValue('district_id', district?.value);
    form.setValue('district', district);
  }

  const onSelectWard = (ward?: OptionForSelect) => {
    setCurWard(ward);
    // Update form values
    form.setValue('ward_id', ward?.value);
    form.setValue('ward', ward);
  }

  const onSelectStreet = (street?: OptionForSelect) => {
    setCurStreet(street);
    // Update form values
    form.setValue('street_id', street?.value);
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

        <div className="grid gap-2">
          <Label htmlFor="subject">Khu vực trên bản đồ</Label>

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
