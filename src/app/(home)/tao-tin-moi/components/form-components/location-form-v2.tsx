'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@components/ui/separator';
import { MapPin, CircleAlert } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { IProductForm } from '@app/(home)/tao-tin-moi/type';
import { useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { center, SimpleLatLng } from '@components/map-leaflet/config';
import { LoadingSpinner } from '@components/icons/loading-spinner';
import MapsApiService from '../../apis/maps-api';
import LocationPickerForm from '@components/location-picker-form';
import { OptionForSelect } from '@models';


interface ILocationForm {
  form: UseFormReturn<IProductForm>;
}

const LocationFormV2: React.FC<ILocationForm> = ({ form }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const { city_id, district_id, ward_id, street_id } = form.getValues();

  const [curCity, setCurCity] = useState({ value: city_id, text: '' });
  const [curDistrict, setCurDistrict] = useState({ value: district_id, text: '' });
  const [curWard, setCurWard] = useState({ value: ward_id, text: '' });
  const [curStreet, setCurStreet] = useState({ value: street_id, text: '' });

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
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    console.log('onSelectDistrict', district)
  }

  const onSelectWard = (ward?: OptionForSelect) => {
    console.log('onSelectWard', ward)
  }

  const onSelectStreet = (street?: OptionForSelect) => {
    console.log('onSelectStreet', street)
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
          onChangeCity={function (city?: OptionForSelect): void {
            onSelectCity(city)
          }} onChangeDistrict={function (district?: OptionForSelect): void {
            onSelectDistrict(district)
          }} onChangeWard={function (ward?: OptionForSelect): void {
            onSelectWard(ward)
          }} onChangeStreet={function (street?: OptionForSelect): void {
            onSelectStreet(street)
          }} />

        <div className="grid gap-2">
          <Label htmlFor="subject">Vị trí trên bản đồ</Label>

        </div>

        <div className="grid gap-2">
          <Label htmlFor="subject">Địa chỉ cụ thể</Label>
          <Input
            id="subject"
            placeholder="Nhập Địa chỉ..."
            value={fullAddress}
            onChange={(e) => { return }
            }
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default LocationFormV2;
