import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocationContext } from '@contexts/LocationContext';

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

  // Use LocationContext for data
  const {
    cities,
    citiesDistricts,
    districtWards,
    districtStreets,
    loadCities,
    loadDistricts,
    loadWards,
    loadStreets,
  } = useLocationContext();

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
    return curCity?.value ? citiesDistricts[curCity.value + ''] || [] : [];
  }, [curCity?.value, citiesDistricts]);

  const wardOptions = useMemo(() => {
    return curDistrict?.value ? districtWards[curDistrict.value + ''] || [] : [];
  }, [curDistrict?.value, districtWards]);

  const streetOptions = useMemo(() => {
    return curDistrict?.value ? districtStreets[curDistrict.value + ''] || [] : [];
  }, [curDistrict?.value, districtStreets]);

  const populateCity = () => {
    if (curCity?.value && !curCity?.text) {
      const foundCity = cities.find((option) => option.value?.toString() === curCity?.value?.toString())
      setCurCity(foundCity)
    }
  }

  const populateDistrict = () => {
    if (curCity?.value && curDistrict?.value && !curDistrict?.text) {
      const foundDistrict = districtOptions.find((option: OptionForSelect) => option.value?.toString() === curDistrict?.value?.toString())
      setCurDistrict(foundDistrict)
    }
  }

  const populateWard = () => {
    if (curDistrict?.value && curWard?.value && !curWard?.text) {
      const foundWard = wardOptions.find((option: OptionForSelect) => option.value?.toString() === curWard?.value?.toString())
      setCurWard(foundWard)
    }
  }

  const populateStreet = () => {
    if (curStreet?.value && !curStreet?.text) {
      const foundStreet = streetOptions.find((option: OptionForSelect) => option.value?.toString() === curStreet?.value?.toString())
      setCurStreet(foundStreet)
    }
  }

  const onSelectCity = async (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();
    resetStreet();
    setCurCity(finalOption);
    setOpenCityDropdown(false);
    onChangeCity(finalOption);
    updateFullAddress({ city: finalOption });
    form.setValue('city_id', finalOption?.value);

    // Load districts for selected city
    if (finalOption?.value) {
      await loadDistricts(finalOption.value.toString());
    }
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

  const onSelectDistrict = async (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;

    resetWard();
    resetStreet();

    setCurDistrict(finalOption);
    setOpenDistrictDropdown(false);
    onChangeDistrict(finalOption);
    updateFullAddress({ district: finalOption });
    form.setValue('district_id', finalOption?.value);

    // Load wards and streets for selected district
    if (finalOption?.value) {
      await Promise.all([
        loadWards(finalOption.value.toString()),
        loadStreets(finalOption.value.toString())
      ]);
    }
  };

  const onSelectWard = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurWard(finalOption);
    setOpenWardDropdown(false);
    onChangeWard(finalOption);
    updateFullAddress({ ward: finalOption });
    form.setValue('ward_id', finalOption?.value);
  };

  const onSelectStreet = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurStreet(finalOption);
    setOpenStreetDropdown(false);
    onChangeStreet(finalOption);
    updateFullAddress({ street: finalOption });
    form.setValue('street_id', finalOption?.value);
  };

  // Load cities on component mount
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // Load initial data based on pre-selected values
  useEffect(() => {
    const loadInitialData = async () => {
      if (curCity?.value) {
        await loadDistricts(curCity.value.toString());

        if (curDistrict?.value) {
          await Promise.all([
            loadWards(curDistrict.value.toString()),
            loadStreets(curDistrict.value.toString())
          ]);
        }
      }
    };

    loadInitialData();
  }, [curCity?.value, curDistrict?.value, loadDistricts, loadWards, loadStreets]);

  useEffect(() => {
    populateOptions();
  }, [populateOptions]);

  const containerRef = useRef(null);

  return (
    <div ref={containerRef}>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="city_id"
          render={({ field }) => (
            <FormItem>
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
                showClear={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district_id"
          render={({ field }) => (
            <FormItem>
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
                showClear={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ward_id"
          render={({ field }) => (
            <FormItem>
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
                showClear={true}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street_id"
          render={({ field }) => (
            <FormItem>
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
                showClear={true}
              />
            </FormItem>
          )}
        />
      </div>

    </div>
  );
}
