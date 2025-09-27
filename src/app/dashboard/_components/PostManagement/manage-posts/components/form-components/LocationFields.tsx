'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

import LocationsPickerFormV2 from '@components/desktop/components/form-fields/LocationsPickerFormV2';
import { FormField, FormItem, FormLabel } from '@components/ui/form';
import { useWatch } from 'react-hook-form';
import { useLocationForm } from '@dashboard/PostManagement/hooks';

const LocationFields: React.FC<A> = ({ form }) => {
  // Check if we should show the location form
  const project = useWatch({ control: form.control, name: 'project' });
  const watchedFullAddress = useWatch({ control: form.control, name: 'full_address' });
  const shouldHideLocation = project?.value && watchedFullAddress;

  // Use the custom hook for location form logic
  const {
    curCity,
    curDistrict,
    curWard,
    curStreet,
    fullAddress,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onSelectStreet,
    onChangedFullAddress,
    mapSrc,
    locationKey: key
  } = useLocationForm({ form });

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
                    onChangedFullAddress(e.target.value)
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

export default LocationFields;
