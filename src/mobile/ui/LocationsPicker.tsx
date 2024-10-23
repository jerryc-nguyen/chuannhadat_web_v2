import { useEffect, useState } from 'react';

import cities from 'src/configs/locations/cities.json';
import citiesDistricts from 'src/configs/locations/cities_districts.json';
import districtWards from 'src/configs/locations/districts_wards.json';

import { OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';

import { List, ListItem } from '@components/konsta';
import { Modal } from '@mobile/modals/states/types';

type LocationsPickerProps = {
  modalOption?: Record<A, A>;
  openModal: (modal: Modal) => void;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
}

export default function LocationsPicker({
  city,
  district,
  ward,
  onChangeCity,
  onChangeDistrict,
  onChangeWard,
  openModal,
  modalOption
}: LocationsPickerProps) {
  if (!modalOption) {
    modalOption = {}
  }

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
    onChangeCity(finalOption);
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;

    resetWard();

    setWardOptions(
      //@ts-ignore: read field of object
      districtWards[finalOption?.value + ''] || [],
    );
    setCurDistrict(finalOption);
    onChangeDistrict(finalOption);
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setCurWard(finalOption);
    onChangeWard(finalOption);
  };

  useEffect(() => {
    populateOptions();
  }, [populateOptions]);


  return (
    <div>
      <List strongIos className="mt-4">
        <ListItem
          link
          title="Thành Phố"
          after={curCity?.text}
          onClick={() => {
            openModal({
              name: 'city',
              title: 'Thành Phố',
              content: (
                <OptionPicker
                  theme="ios"
                  searchable
                  options={[ALL_OPTION, ...cities]}
                  value={curCity}
                  onSelect={onSelectCity}
                />
              ),
              maxHeightPercent: 0.6,
              ...modalOption
            });
          }}
        />

        <ListItem
          link
          title="Quận / Huyện"
          after={curDistrict?.text}
          onClick={() => {
            openModal({
              name: 'district',
              title: 'Quận / Huyện',
              content: (
                <OptionPicker
                  theme="ios"
                  searchable
                  options={[ALL_OPTION, ...districtOptions]}
                  value={curDistrict}
                  onSelect={onSelectDistrict}
                  emptyMessage="Vui lòng chọn trước Tỉnh / Thành Phố"
                />
              ),
              maxHeightPercent: 0.6,
              ...modalOption
            });
          }}
        />

        <ListItem
          link
          title="Phường / Xã"
          after={curWard?.text}
          onClick={() => {
            openModal({
              name: 'ward',
              title: 'Phường / Xã',
              content: (
                <OptionPicker
                  theme="ios"
                  searchable
                  options={[ALL_OPTION, ...wardOptions]}
                  value={curWard}
                  onSelect={onSelectWard}
                  emptyMessage="Vui lòng chọn trước Quận / Huyện"
                />
              ),
              maxHeightPercent: 0.6,
              ...modalOption
            });
          }}
        />
      </List>
    </div>
  );
}
