'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@components/ui/separator';
import { MapPin, CircleAlert } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IProductForm } from '@app/(home)/tao-tin-moi/type';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LocationPickerForm from '@components/location-picker-form';
import { OptionForSelect } from '@models';

interface ILocationForm {
  form: UseFormReturn<IProductForm>;
}

const LocationFormV2: React.FC<ILocationForm> = ({ form }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const { city_id, district_id, ward_id, street_id } = form.getValues();

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
    updateFullAddress({ city: city });
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    console.log('onSelectDistrict', district)
    setCurDistrict(district);
    updateFullAddress({ district: district });
  }

  const onSelectWard = (ward?: OptionForSelect) => {
    console.log('onSelectWard', ward)
    setCurWard(ward);
    updateFullAddress({ ward: ward });
  }

  const onSelectStreet = (street?: OptionForSelect) => {
    console.log('onSelectStreet', street)
    setCurStreet(street)
    updateFullAddress({ street: street });
  }


  const updateFullAddress = ({ city, district, ward, street }: { city?: OptionForSelect, district?: OptionForSelect, ward?: OptionForSelect, street?: OptionForSelect }) => {
    const address = [
      street?.text || curStreet?.text,
      ward?.text || curWard?.text,
      district?.text || curDistrict?.text,
      city?.text || curCity?.text
    ].filter((text) => (text || '').length > 0).join(', ')
    setFullAddress(address)
  }

  return (
    <Card className="bg-primary/10">
      <CardHeader>
        <CardTitle className="text-md flex gap-2">
          <MapPin /> Tìm kiếm địa chỉ bất động sản
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="grid gap-6">

        <LocationPickerForm form={form} city={curCity} district={curDistrict} ward={curWard} street={curStreet}
          onChangeCity={onSelectCity}
          onChangeDistrict={onSelectDistrict}
          onChangeWard={onSelectWard}
          onChangeStreet={onSelectStreet} />

        <div className="grid gap-2">
          <Label htmlFor="subject">Vị trí trên bản đồ</Label>
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
    </Card>
  );
};

export default LocationFormV2;
