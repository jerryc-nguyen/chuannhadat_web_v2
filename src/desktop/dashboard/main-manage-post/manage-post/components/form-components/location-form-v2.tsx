'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@components/ui/separator';
import { MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';

import { OptionForSelect } from '@models';
import LocationsPickerFormV2 from '@desktop/components/form-fields/LocationsPickerFormV2';
import { FormField, FormItem, FormLabel } from '@components/ui/form';

const LocationFormV2: React.FC<A> = ({ form }) => {
  const { city_id, district_id, ward_id, street_id } = form.getValues();
  const [curCity, setCurCity] = useState<OptionForSelect | undefined>({ value: city_id, text: '' });
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>({ value: district_id, text: '' });
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>({ value: ward_id, text: '' });
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>({ value: street_id, text: '' });

  const [fullAddress, setFullAddress] = useState<string>(form.getValues('full_address'));

  const onSelectCity = (city?: OptionForSelect) => {
    console.log('onSelectCity', city)
    setCurCity(city);
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    console.log('onSelectDistrict', district)
    setCurDistrict(district);
  }

  const onSelectWard = (ward?: OptionForSelect) => {
    console.log('onSelectWard', ward)
    setCurWard(ward);
  }

  const onSelectStreet = (street?: OptionForSelect) => {
    console.log('onSelectStreet', street)
    setCurStreet(street)
  }

  const onChangedFullAddress = (address: string) => {
    setFullAddress(address)
    form.setValue('full_address', address)
  }

  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${fullAddress}&output=embed`
  }, [fullAddress])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Khu vực bất động sản
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <LocationsPickerFormV2
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
    </Card >
  );
};

export default LocationFormV2;
