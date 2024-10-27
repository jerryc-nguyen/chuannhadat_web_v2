import { useEffect, useState, useRef, useMemo } from 'react';

import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';
import districtStreets from 'src/configs/locations/districts_streets.json';

import { OptionForSelect } from '@models';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import DropdownSelectField from '../custom-form-fields/DropdownSelect';

interface ILocationForm {
  form: UseFormReturn<A>;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  street?: OptionForSelect;
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
  onChangeStreet: (street?: OptionForSelect) => void;
  onChangedFullAddress?: (address: string) => void;
}

export default function LocationsPickerFormV2({
  form,
  city,
  district,
  ward,
  street,
  onChangeCity,
  onChangeDistrict,
  onChangeWard,
  onChangeStreet,
  onChangedFullAddress
}: ILocationForm) {

  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(city);
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(district);
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(ward);
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>(street);

  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [openDistrictDropdown, setOpenDistrictDropdown] = useState(false);
  const [openWardDropdown, setOpenWardDropdown] = useState(false);
  const [openStreetDropdown, setOpenStreetDropdown] = useState(false);

  const resetDistrict = () => {
    setCurDistrict(undefined);
  };

  const resetWard = () => {
    setCurWard(undefined);
  };

  const resetStreet = () => {
    setCurStreet(undefined);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const populateOptions = () => {
    if (city?.value) {
      populateCity();
      populateDistrict();
      populateWard();
      populateStreet();
    }
  };

  const districtOptions = useMemo(() => {
    //@ts-ignore: read field of object
    return citiesDistricts[city.value + '']
  }, [city?.value])

  const wardOptions = useMemo(() => {
    return curDistrict?.value
      // @ts-ignore: ok
      ? districtWards[curDistrict?.value + ''] : []
  }, [curDistrict?.value])

  const streetOptions = useMemo(() => {
    return curDistrict?.value
      // @ts-ignore: ok
      ? districtStreets[curDistrict?.value + ''] : []
  }, [curDistrict?.value])

  const populateCity = () => {
    if (curCity?.value && !curCity?.text) {
      city = cities.find((option) => option.value.toString() == curCity?.value)
      setCurCity(city)
    }
  }

  const populateDistrict = () => {
    if (curCity?.value && curDistrict?.value && !curDistrict?.text) {
      district = districtOptions.find((option: A) => option.value.toString() == curDistrict?.value)
      setCurDistrict(district)
    }
  }

  const populateWard = () => {
    if (curDistrict?.value && curWard?.value && !curWard?.text) {
      ward = wardOptions.find((option: A) => option.value.toString() == curWard?.value)
      setCurWard(ward)
    }
  }

  const populateStreet = () => {
    if (curDistrict?.value && curStreet?.value && !curStreet?.text) {
      street = streetOptions.find((option: A) => option.value.toString() == curStreet?.value)
      setCurStreet(street)
    }
  }

  const onSelectCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();
    resetStreet();
    setCurCity(finalOption);
    setOpenCityDropdown(false);
    onChangeCity(finalOption);
    updateFullAddress({ city: finalOption });
  };

  const fullAddress = ({ city, district, ward, street }: { city?: OptionForSelect, district?: OptionForSelect, ward?: OptionForSelect, street?: OptionForSelect }): string => {
    const address = [
      street?.text || curStreet?.text,
      ward?.text || curWard?.text,
      district?.text || curDistrict?.text,
      city?.text || curCity?.text
    ].filter((text) => (text || '').length > 0).join(', ')
    return address;
  }

  const updateFullAddress = ({ city, district, ward, street }: { city?: OptionForSelect, district?: OptionForSelect, ward?: OptionForSelect, street?: OptionForSelect }) => {
    const newAdress = fullAddress({ city, district, ward, street });
    if (onChangedFullAddress) {
      onChangedFullAddress(newAdress)
    }
  }

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;

    resetWard();
    resetStreet();

    setCurDistrict(finalOption);
    setOpenDistrictDropdown(false);
    onChangeDistrict(finalOption);
    updateFullAddress({ district: finalOption });
  };

  const onSelectWard = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurWard(finalOption);
    setOpenWardDropdown(false);
    onChangeWard(finalOption);
    updateFullAddress({ ward: finalOption });
  };

  const onSelectStreet = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurStreet(finalOption);
    setOpenStreetDropdown(false);
    onChangeStreet(finalOption);
    updateFullAddress({ street: finalOption });
  };


  useEffect(() => {
    populateOptions();
  }, [populateOptions]);

  const containerRef = useRef(null);

  return (
    <div ref={containerRef}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="city_id"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>
                <span className="text-red-600">*</span> Tỉnh/ Thành phố
              </FormLabel>

              <DropdownSelectField
                options={cities}
                placeholder='Chọn Thành Phố'
                selectedOption={curCity}
                openDropdown={openCityDropdown}
                setOpenDropdown={setOpenCityDropdown}
                updateFieldValue={field.onChange}
                containerRef={containerRef}
                onSelect={onSelectCity}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district_id"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>
                <span className="text-red-600">*</span> Quận/ Huyện
              </FormLabel>
              <DropdownSelectField
                options={districtOptions}
                placeholder='Chọn Quận / Huyện'
                selectedOption={curDistrict}
                openDropdown={openDistrictDropdown}
                setOpenDropdown={setOpenDistrictDropdown}
                updateFieldValue={field.onChange}
                containerRef={containerRef}
                onSelect={onSelectDistrict}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ward_id"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Phường/ Xã</FormLabel>
              <DropdownSelectField
                options={wardOptions}
                placeholder='Chọn Phường / Xã'
                selectedOption={curWard}
                openDropdown={openWardDropdown}
                setOpenDropdown={setOpenWardDropdown}
                updateFieldValue={field.onChange}
                containerRef={containerRef}
                onSelect={onSelectWard}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street_id"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Đường/ Phố</FormLabel>
              <DropdownSelectField
                options={[...streetOptions]}
                placeholder='Chọn Đường/ Phố'
                selectedOption={curStreet}
                openDropdown={openStreetDropdown}
                setOpenDropdown={setOpenStreetDropdown}
                updateFieldValue={field.onChange}
                containerRef={containerRef}
                onSelect={onSelectStreet}
              />
            </FormItem>
          )}
        />
      </div>

    </div>
  );
}
