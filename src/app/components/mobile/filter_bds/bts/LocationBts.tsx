import { useState } from 'react';
import { useAtom } from 'jotai';
import ReactSelect from 'react-tailwindcss-select';

import { Sheet, Toolbar, Link } from 'konsta/react';

import {
  FilterOption,
  FilterFieldName,
} from '@mbcom/filter_bds/types';

import ListOptions from './ListOptions';
import {
  openBottomSheetFilterAtom,
  filterStateAtom,
  defaultFilterOption,
} from '@mbcom/filter_bds/states';
import BottomActions from './BottomActions';

import searchFormOptions from '@mbcom/filter_bds/states/search_form_options.json';
import { formattedReactSelectOptions } from '@mbcom/filter_bds/helpers';

export default function LocationBts() {
  const [isOpen, setIsOpen] = useAtom(openBottomSheetFilterAtom);
  const [filterState] = useAtom(filterStateAtom);
  const [selectedOption, setSelectedOption] = useState<FilterOption>(
    defaultFilterOption
  );
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);

  const cityOptions = formattedReactSelectOptions(
    searchFormOptions.locations.cities
  );

  const districtsOptions = formattedReactSelectOptions(
    searchFormOptions.locations.districts
  );

  const wardsOptions = formattedReactSelectOptions(
    searchFormOptions.locations.wards
  );

  const handleChange = (value) => {
    console.log('value:', value);
  };

  const onCityChange = (option) => {
    console.log('onCityChange', option);
    setCity(option);
  };
  const onDistrictChange = (option) => {
    setDistrict(option);
  };
  const onWardChange = (option) => {
    setWard(option);
  };

  return (
    <Sheet
      className='c-bottomSheetFilter pb-safe w-full'
      opened={isOpen}
      onBackdropClick={() => setIsOpen(false)}
    >
      <Toolbar top>
        <div className='left'>
          <strong>Khu vực</strong>
        </div>
        <div className='right'>
          <Link toolbar onClick={() => setIsOpen(false)}>
            Đóng
          </Link>
        </div>
      </Toolbar>

      <div className='c-bottomSheetFilter__body is-locations'>
        <div className='p-4'>
          <div>
            <p className='pb-2'>Tỉnh / Thành phố</p>
            <ReactSelect
              isSearchable={true}
              options={cityOptions}
              onChange={onCityChange}
              value={city}
            />
          </div>

          <div className='mt-4'>
            <p className='pb-2'>Quận Huyện</p>
            <ReactSelect
              isSearchable={true}
              options={districtsOptions}
              onChange={onDistrictChange}
              value={district}
            />
          </div>

          <div className='mt-4'>
            <p className='pb-2'>Phường / Xã</p>
            <ReactSelect
              isSearchable={true}
              options={wardsOptions}
              onChange={onWardChange}
              value={ward}
            />
          </div>
        </div>
      </div>

      <BottomActions
        fieldName={FilterFieldName.direction}
        selectedOption={selectedOption}
      />
    </Sheet>
  );
}
