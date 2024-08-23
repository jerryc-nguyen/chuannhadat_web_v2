import { useEffect, useState } from 'react';
import { List, ListItem } from 'konsta/react';

import useModals from '@mobile/modals/hooks';
import { ModalNames } from '@mobile/modals/states/types';
import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';

export default function Locations() {
  const { openModal3, closeModal3 } = useModals();

  const { setLocalFieldValue, localFilterState } =
    useFilterState();

  const city = localFilterState.city;
  const district = localFilterState.district;
  const ward = localFilterState.ward;

  const [districtOptions, setDistrictOptions] = useState(
    [],
  );
  const [wardOptions, setWardOptions] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDistrict = () => {
    setLocalFieldValue(FilterFieldName.district, undefined);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setLocalFieldValue(FilterFieldName.ward, undefined);
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
    const finalOption =
      city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();

    setDistrictOptions(
      //@ts-ignore: read field of object
      citiesDistricts[finalOption?.value + ''] || [],
    );
    setLocalFieldValue(FilterFieldName.city, finalOption);
    closeModal3();
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption =
      district?.value != 'all' ? district : undefined;

    resetWard();
  
    setWardOptions(
      //@ts-ignore: read field of object
      districtWards[finalOption?.value + ''] || [],
    );
    setLocalFieldValue(
      FilterFieldName.district,
      finalOption,
    );
    closeModal3();
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption =
      ward?.value != 'all' ? ward : undefined;
    setLocalFieldValue(FilterFieldName.ward, finalOption);
    closeModal3();
  };

  useEffect(() => {
    populateOptions();
  }, [populateOptions]);

  return (
    <div>
      <List strongIos>
        <ListItem
          link
          title="Thành Phố"
          after={city?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.city,
              title: 'Thành Phố',
              content: (
                <OptionPicker
                  searchable
                  options={[ALL_OPTION, ...cities]}
                  value={city}
                  onSelect={onSelectCity}
                />
              ),
              maxHeightPercent: 0.5,
            });
          }}
        />

        <ListItem
          link
          title="Quận / Huyện"
          after={district?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.district,
              title: 'Quận / Huyện',
              content: (
                <OptionPicker
                  searchable
                  options={[ALL_OPTION, ...districtOptions]}
                  value={district}
                  onSelect={onSelectDistrict}
                  emptyMessage="Vui lòng chọn trước Tỉnh / Thành Phố"
                />
              ),
              maxHeightPercent: 0.5,
            });
          }}
        />

        <ListItem
          link
          title="Phường / Xã"
          after={ward?.text}
          onClick={() => {
            openModal3({
              name: ModalNames.ward,
              title: 'Phường / Xã',
              content: (
                <OptionPicker
                  searchable
                  options={[ALL_OPTION, ...wardOptions]}
                  value={ward}
                  onSelect={onSelectWard}
                  emptyMessage="Vui lòng chọn trước Quận / Huyện"
                />
              ),
              maxHeightPercent: 0.5,
            });
          }}
        />
      </List>
    </div>
  );
}
