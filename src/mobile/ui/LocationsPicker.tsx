import { useEffect, useMemo, useState } from 'react';
import { useLocationPicker } from '@contexts/LocationContext';

import { OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';

import { List, ListItem } from '@components/konsta';
import { Modal } from '@mobile/modals/states/types';

type LocationsPickerProps = {
  withStreet?: boolean;
  modalOption?: Record<A, A>;
  openModal: (modal: Modal) => void;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  street?: OptionForSelect;
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
  onChangeStreet?: (street?: OptionForSelect) => void;
  onChangedFullAddress?: (address: string) => void;
}

export default function LocationsPicker({
  city,
  district,
  ward,
  street,
  onChangeCity,
  onChangeDistrict,
  onChangeWard,
  onChangeStreet,
  onChangedFullAddress,
  openModal,
  modalOption,
  withStreet
}: LocationsPickerProps) {
  if (!modalOption) {
    modalOption = {}
  }

  // Get location data from context
  const {
    cities,
    citiesDistricts,
    districtWards,
    districtStreets,
    loadCities,
    loadDistrictsForCity,
    loadWardsForDistrict,
    loadStreetsForDistrict
  } = useLocationPicker();

  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(city);
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(district);
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(ward);
  const [curStreet, setCurStreet] = useState<OptionForSelect | undefined>(street);

  // Auto-load data when selections change
  useEffect(() => {
    if (curCity?.value) {
      loadDistrictsForCity(curCity.value);
    }
  }, [curCity?.value, loadDistrictsForCity]);

  useEffect(() => {
    if (curDistrict?.value) {
      loadWardsForDistrict(curDistrict.value);
      if (withStreet) {
        loadStreetsForDistrict(curDistrict.value);
      }
    }
  }, [curDistrict?.value, loadWardsForDistrict, loadStreetsForDistrict, withStreet]);

  const districtOptions = useMemo(() => {
    return citiesDistricts[curCity?.value + ''] || []
  }, [citiesDistricts, curCity?.value])

  const wardOptions = useMemo(() => {
    return curDistrict?.value
      ? districtWards[curDistrict?.value + ''] || [] : []
  }, [districtWards, curDistrict?.value])

  const streetOptions = useMemo(() => {
    return curDistrict?.value
      ? districtStreets[curDistrict?.value + ''] || [] : []
  }, [districtStreets, curDistrict?.value])

  const resetDistrict = () => {
    setCurDistrict(undefined);
  };

  const resetWard = () => {
    setCurWard(undefined);
  };

  const resetStreet = () => {
    setCurStreet(undefined);
  };

  const populateCity = () => {
    if (curCity?.value && !curCity?.text) {
      const foundCity = cities.find((option) => option.value?.toString() === curCity?.value?.toString())
      setCurCity(foundCity)
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
    if (curStreet?.value && !curStreet?.text) {
      street = streetOptions.find((option: A) => option.value.toString() == curStreet?.value)
      setCurStreet(street)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const populateOptions = () => {
    if (city?.value) {
      populateCity();
      populateDistrict();
      populateWard();
      populateStreet();
    }
  };

  const onSelectCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();
    resetStreet();

    setCurCity(finalOption);
    onChangeCity(finalOption);

    updateFullAddress({ city: finalOption });
  };

  const onSelectDistrict = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;

    resetWard();
    resetStreet();

    setCurDistrict(finalOption);
    onChangeDistrict(finalOption);
    updateFullAddress({ city: curCity, district: finalOption });
  };

  const onSelectWard = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurWard(finalOption);
    onChangeWard(finalOption);
    updateFullAddress({ city: curCity, district: curDistrict, ward: finalOption });
  };

  const onSelectStreet = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setCurStreet(finalOption);
    if (onChangeStreet) {
      onChangeStreet(finalOption);
    }

    updateFullAddress({ city: curCity, district: curDistrict, ward: curWard, street: finalOption });
  };

  const updateFullAddress = ({ city, district, ward, street }: { city?: OptionForSelect, district?: OptionForSelect, ward?: OptionForSelect, street?: OptionForSelect }) => {
    const newAdress = fullAddress({ city, district, ward, street });
    if (onChangedFullAddress) {
      onChangedFullAddress(newAdress)
    }
  }

  const fullAddress = ({ city, district, ward, street }: { city?: OptionForSelect, district?: OptionForSelect, ward?: OptionForSelect, street?: OptionForSelect }): string => {
    const address = [
      street?.text,
      ward?.text,
      district?.text,
      city?.text
    ].filter((text) => (text || '').length > 0).join(', ')
    return address;
  }


  useEffect(() => {
    populateOptions();
  }, [populateOptions]);


  return (
    <div>
      <List strongIos margin="mt-2 mb-8">
        <ListItem
          link
          title="Thành Phố"
          after={curCity?.text}
          value={curCity?.value}
          onClear={() => {
            onSelectCity({ value: '', text: '' })
          }}
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
          value={curDistrict?.value}
          onClear={() => {
            onSelectDistrict({ value: '', text: '' })
          }}
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
          value={curWard?.value}
          onClear={() => {
            onSelectWard({ value: '', text: '' })
          }}
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

        {withStreet && (
          <ListItem
            link
            title="Đường/ Phố"
            value={curStreet?.value}
            onClear={() => {
              onSelectStreet({ value: '', text: '' })
            }}
            after={curStreet?.text}
            onClick={() => {
              openModal({
                name: 'street',
                title: 'Đường/ Phố',
                content: (
                  <OptionPicker
                    theme="ios"
                    searchable
                    options={[ALL_OPTION, ...streetOptions]}
                    value={curStreet}
                    onSelect={onSelectStreet}
                    emptyMessage="Vui lòng chọn trước Quận / Huyện"
                  />
                ),
                maxHeightPercent: 0.6,
                ...modalOption
              });
            }}
          />
        )}

      </List>
    </div>
  );
}
