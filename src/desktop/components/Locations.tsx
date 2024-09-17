import { useEffect, useState } from 'react';

import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';
import { LuChevronsUpDown } from 'react-icons/lu';

import { OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';
import { PopoverContent, PopoverTrigger, Popover } from '@components/ui/popover';

import { Button } from '@components/ui/button';

export default function Locations({
  city,
  district,
  ward,
}: {
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
}) {
  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(city);
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(district);
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(ward);

  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  const resetDistrict = () => {
    setCurDistrict(undefined);
  };

  const resetWard = () => {
    setCurWard(undefined);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const populateOptions = () => {
    if (city) {
      setDistrictOptions(
        //@ts-ignore: read field of object
        citiesDistricts[city.value + ''],
      );
    }
    if (district) {
      setWardOptions(
        //@ts-ignore: read field of object
        districtWards[district.value + ''],
      );
    }
  };

  const onSelectCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();

    setDistrictOptions(
      //@ts-ignore: read field of object
      citiesDistricts[finalOption?.value + ''] || [],
    );
    setCurCity(finalOption);
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;

    resetWard();

    setWardOptions(
      //@ts-ignore: read field of object
      districtWards[finalOption?.value + ''] || [],
    );
    setCurDistrict(finalOption);
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setCurWard(finalOption);
  };

  useEffect(() => {
    populateOptions();
  }, [populateOptions]);

  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [openDistrictDropdown, setOpenDistrictDropdown] = useState(false);
  const [openWardDropdown, setOpenWardDropdown] = useState(false);

  return (
    <div>
      <Popover open={openCityDropdown} onOpenChange={setOpenCityDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCityDropdown}
            className="w-[300px] justify-between pr-2"
          >
            {curCity?.text || 'Chọn Thành Phố'}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="end" side="right">
          <OptionPicker
            searchable
            options={[ALL_OPTION, ...cities]}
            value={curCity}
            onSelect={onSelectCity}
          />
        </PopoverContent>
      </Popover>

      <Popover open={openDistrictDropdown} onOpenChange={setOpenDistrictDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openDistrictDropdown}
            className="w-[300px] justify-between pr-2"
          >
            {curDistrict?.text || 'Chọn Quận / Huyện'}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="end" side="right">
          <OptionPicker
            searchable
            options={[ALL_OPTION, ...districtOptions]}
            value={curDistrict}
            onSelect={onSelectDistrict}
          />
        </PopoverContent>
      </Popover>

      <Popover open={openWardDropdown} onOpenChange={setOpenWardDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openWardDropdown}
            className="w-[300px] justify-between pr-2"
          >
            {curWard?.text || 'Chọn Phường / Xã'}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="end" side="right">
          <OptionPicker
            searchable
            options={[ALL_OPTION, ...wardOptions]}
            value={curWard}
            onSelect={onSelectWard}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
