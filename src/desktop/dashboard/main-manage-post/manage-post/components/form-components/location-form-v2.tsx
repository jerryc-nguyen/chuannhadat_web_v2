'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@components/ui/separator';
import { MapPin } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { OptionForSelect } from '@models';
import LocationsPickerFormV2 from '@desktop/components/form-fields/LocationsPickerFormV2';

const LocationFormV2: React.FC<A> = ({ form }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const { city_id, district_id, ward_id, street_id } = form.getValues();
  console.log('city_id', city_id);
  const [curCity, setCurCity] = useState<OptionForSelect | undefined>({ value: city_id, text: '' });
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>({ value: district_id, text: '' });
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>({ value: ward_id, text: '' });
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>({ value: street_id, text: '' });

  useEffect(() => {
    setIsFirstLoad(true);
  }, []);

  const [fullAddress, setFullAddress] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('isLoading', isLoading);
  }, [isLoading]);

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
  }

  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${fullAddress}&output=embed`
  }, [fullAddress])

  return (
    <Card className="bg-primary/10">
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Chọn địa chỉ bất động sản
        </CardTitle>
        <Separator />
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
          <Label htmlFor="subject">Vị trí trên bản đồ</Label>

          <iframe
            className='w-full min-h-64'
            style={{ border: 0 }}
            loading="lazy"
            src={mapSrc}></iframe>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subject">Địa chỉ cụ thể</Label>
          <Input
            id="subject"
            placeholder="Nhập Địa chỉ..."
            value={fullAddress}
            onChange={(e) => { setFullAddress(e.target.value) }}
          />
        </div>

      </CardContent>
    </Card >
  );
};

export default LocationFormV2;
