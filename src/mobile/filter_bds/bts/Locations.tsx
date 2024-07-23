import { ReactNode, useCallback, useEffect, useState } from 'react';
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

import OptionPicker, { OptionProps } from '@mobile/ui/OptionPicker';
import { useFilterLocations } from '@mobile/locations/hooks';

import useModals from '@mobile/modals/hooks';
import { ModalNames } from '@mobile/modals/states/types';
import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';

type LocationOptionProps = LocationOption | undefined;

export const selectOptiontToFilterOption = (
  option: OptionProps,
  field_name: string
) => {
  return {
    text: option.text,
    params: { [field_name]: option.id },
  };
};
export default function Locations() {
  const { openModal3 } = useModals();

  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );
  const { currentCity, currentDistrict, currentWard } =
    useFilterLocations();

  const [city, setCity] = useState<LocationOptionProps>(currentCity);
  const [district, setDistrict] =
    useState<LocationOptionProps>(currentDistrict);
  const [ward, setWard] = useState<LocationOptionProps>(currentWard);

  const [districtOptions, setDistrictOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDistrict = () => {
    setDistrict(undefined);
    localFilterState.district = undefined;
    setLocalFilterState(localFilterState);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setWard(undefined);
    localFilterState.ward = undefined;
    setLocalFilterState(localFilterState);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const populateOptions = () => {
    if (currentCity) {
      //@ts-ignore
      setDistrictOptions(citiesDistricts[currentCity?.id + ''] || []);
    }
    if (currentDistrict) {
      //@ts-ignore
      setWardOptions(districtWards[currentDistrict?.id + ''] || []);
    }
  };

  const onSelectCity = (city?: LocationOption) => {
    setCity(city);
    resetDistrict();
    resetWard();
    //@ts-ignore
    setDistrictOptions(citiesDistricts[city?.id + ''] || []);
    localFilterState.city = city;
    setLocalFilterState(localFilterState);
  };

  const onSelectDistrict = (district?: LocationOption) => {
    localFilterState.district = district;

    //@ts-ignore
    setWardOptions(districtWards[district?.id + ''] || []);
    setLocalFilterState(localFilterState);
    resetWard();
    setDistrict(district);
  };

  const onSelectWard = (ward?: LocationOption) => {
    setWard(ward);
    localFilterState.ward = ward;
    setLocalFilterState(localFilterState);
  };

  useEffect(() => {
    populateOptions();
  }, [populateOptions]);

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
