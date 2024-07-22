import { ReactNode, useState } from 'react';
import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
  LocationOption,
} from '@mobile/filter_bds/types';

import {
  filterStateAtom,
  defaultFilterOption,
  localFilterStateAtom,
} from '@mobile/filter_bds/states';
import { List, ListItem } from 'konsta/react';

import OptionPicker from '@mobile/ui/OptionPicker';
import useLocations from '@mobile/locations/hooks';

import useModals from '@mobile/modals/hooks';
import { ModalNames } from '@mobile/modals/states/types';
import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';

export default function Locations() {
  useLocations();
  const { openModal3 } = useModals();

  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );
  const currentCity = {
    id: localFilterState.city?.params?.city_id,
    text: localFilterState.city?.text,
  };
  const currentDistrict = {
    id: localFilterState.district?.params?.district_id,
    text: localFilterState.district?.text,
  };

  const currentWard = {
    id: localFilterState.ward?.params?.ward_id,
    text: localFilterState.ward?.text,
  };

  const [city, setCity] = useState<LocationOption>(currentCity);
  const [district, setDistrict] =
    useState<LocationOption>(currentDistrict);
  const [ward, setWard] = useState<LocationOption>(currentWard);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  const onSelectCity = (city: LocationOption) => {
    setCity(city);
    //@ts-ignore
    setDistrictOptions(citiesDistricts[city?.id + ''] || []);
  };

  const onSelectDistrict = (district: LocationOption) => {
    setDistrict(district);
    //@ts-ignore
    setWardOptions(districtWards[district?.id + ''] || []);
  };

  const onSelectWard = (ward: LocationOption) => {
    setWard(ward);
  };

  return (
    <div>
      <List strongIos>
        <ListItem
          link
          title='Thành Phố'
          after={city?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.city,
              title: 'Thành Phố',
              content: (
                <OptionPicker
                  searchable
                  options={cities}
                  value={city}
                  onSelect={onSelectCity}
                />
              ),
              maxHeightPercent: 0.8,
            });
          }}
        />

        <ListItem
          link
          title='Quận / Huyện'
          after={district?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.district,
              title: 'Quận / Huyện',
              content: (
                <OptionPicker
                  options={districtOptions}
                  value={district}
                  onSelect={onSelectDistrict}
                />
              ),
              maxHeightPercent: 0.8,
            });
          }}
        />

        <ListItem
          link
          title='Phường / Xã'
          after={ward?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.ward,
              title: 'Phường / Xã',
              content: (
                <OptionPicker
                  options={wardOptions}
                  value={ward}
                  onSelect={onSelectWard}
                />
              ),
              maxHeightPercent: 0.8,
            });
          }}
        />
      </List>
    </div>
  );
}
