import { useState, useRef, useMemo, useEffect } from 'react';
import { useLocationPicker } from '@contexts/LocationContext';
import { ChevronsUpDown } from 'lucide-react';

import { OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';
import { PopoverContent, PopoverTrigger, Popover } from '@components/ui/popover';

import { Button } from '@components/ui/button';

interface LocationsPickerProps {
  theme?: string;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  city_ids?: string[];
  district_ids?: string[];
  ward_ids?: string[];
  city_counts?: Record<string, number>;
  district_counts?: Record<string, number>;
  ward_counts?: Record<string, number>;
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
  // New props for data injection
  cities?: OptionForSelect[];
  citiesDistricts?: Record<string, OptionForSelect[]>;
  districtWards?: Record<string, OptionForSelect[]>;
  isLoadingDistricts?: boolean;
  isLoadingWards?: boolean;
}

export default function LocationsPicker({
  city,
  district,
  ward,
  theme: _theme,
  city_ids = [],
  district_ids = [],
  ward_ids = [],
  city_counts: _city_counts,
  district_counts: _district_counts,
  ward_counts: _ward_counts,
  onChangeDistrict,
  onChangeWard,
  onChangeCity,
}: Omit<LocationsPickerProps, 'cities' | 'citiesDistricts' | 'districtWards' | 'isLoadingDistricts' | 'isLoadingWards'>) {

  // Get location data from context
  const {
    cities,
    citiesDistricts,
    districtWards,
    isLoadingDistricts,
    isLoadingWards,
    loadCities,
    loadDistrictsForCity,
    loadWardsForDistrict
  } = useLocationPicker();

  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(city);
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(district);
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(ward);

  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [openDistrictDropdown, setOpenDistrictDropdown] = useState(false);
  const [openWardDropdown, setOpenWardDropdown] = useState(false);

  // Auto-load districts when city changes
  useEffect(() => {
    if (curCity?.value) {
      loadDistrictsForCity(curCity.value);
    }
  }, [curCity?.value, loadDistrictsForCity]);

  // Auto-load wards when district changes
  useEffect(() => {
    if (curDistrict?.value) {
      loadWardsForDistrict(curDistrict.value);
    }
  }, [curDistrict?.value, loadWardsForDistrict]);

  const resetDistrict = () => {
    setCurDistrict(undefined);
  };

  const resetWard = () => {
    setCurWard(undefined);
  };

  const onSelectCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();

    setCurCity(finalOption);
    setOpenCityDropdown(false);
    onChangeCity(finalOption);
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;

    resetWard();

    setCurDistrict(finalOption);
    setOpenDistrictDropdown(false);
    onChangeDistrict(finalOption);
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setCurWard(finalOption);
    setOpenWardDropdown(false);
    onChangeWard(finalOption);
  };

  const citiesOptions = useMemo(() => {
    if (Array.isArray(city_ids) && city_ids.length > 0) {
      return cities.filter((item: OptionForSelect) => city_ids.includes(item.value + ''))
    } else {
      return cities
    }
  }, [cities, city_ids])

  const districtOptions = useMemo(() => {
    const districts = citiesDistricts[curCity?.value + ''] || []
    if (Array.isArray(district_ids) && district_ids.length > 0) {
      return districts.filter((item: OptionForSelect) => district_ids.includes(item.value + ''))
    } else {
      return districts
    }
  }, [citiesDistricts, curCity?.value, district_ids])

  const wardOptions = useMemo(() => {
    const wards = curDistrict?.value
      ? districtWards[curDistrict?.value + ''] || [] : []

    if (Array.isArray(ward_ids) && ward_ids.length > 0) {
      return wards.filter((item: OptionForSelect) => ward_ids.includes(item.value + ''))
    } else {
      return wards
    }

  }, [districtWards, curDistrict?.value, ward_ids])

  const containerRef = useRef(null);

  return (
    <div ref={containerRef}>
      <Popover
        open={openCityDropdown}
        onOpenChange={(open) => {
          if (open) {
            loadCities(); // Load cities only when user opens dropdown
          }
          setOpenCityDropdown(open);
        }}
      >
        <PopoverTrigger asChild>

          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCityDropdown}
            aria-haspopup="listbox"
            aria-label="Chọn thành phố"
            className="w-full justify-between pr-2"
          >
            {curCity?.text || 'Chọn Thành Phố'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent container={containerRef.current} className="p-0" align="end" side="right">
          <OptionPicker
            searchable
            options={[ALL_OPTION, ...citiesOptions]}
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
            aria-haspopup="listbox"
            aria-label="Chọn quận/huyện"
            className="mt-2 w-full justify-between pr-2"
            disabled={!curCity || isLoadingDistricts}
          >
            {isLoadingDistricts ? 'Đang tải...' : (curDistrict?.text || 'Chọn Quận / Huyện')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent container={containerRef.current} className="p-0" align="end" side="right">
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
            aria-haspopup="listbox"
            aria-label="Chọn phường/xã"
            className="mt-2 w-full justify-between pr-2"
            disabled={!curDistrict || isLoadingWards}
          >
            {isLoadingWards ? 'Đang tải...' : (curWard?.text || 'Chọn Phường / Xã')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="end" side="right">
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
