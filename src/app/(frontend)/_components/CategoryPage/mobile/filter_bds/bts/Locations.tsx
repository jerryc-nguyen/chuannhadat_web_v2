import useModals from '@components/features/layout/mobile-modals/hooks';
import useFilterState from '../hooks/useFilterState';
import { FilterFieldName, OptionForSelect } from '@common/models';
import LocationsPicker from '@components/mobile-ui/LocationsPicker';
import { useLocationPicker } from '@contexts/LocationContext';
import { useEffect } from 'react';

export default function Locations() {
  const { openModal3, closeModal3 } = useModals();
  const { setLocalFieldValue, localFilterState } = useFilterState();

  // Preload cities when this component mounts
  const { loadCities } = useLocationPicker();

  useEffect(() => {
    // Preload cities as soon as the locations filter opens
    loadCities();
  }, [loadCities]);

  const city = localFilterState.city;
  const district = localFilterState.district;
  const ward = localFilterState.ward;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDistrict = () => {
    setLocalFieldValue(FilterFieldName.District, undefined);
    localFilterState.district = undefined;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setLocalFieldValue(FilterFieldName.Ward, undefined);
    localFilterState.ward = undefined;
  };

  const onChangeCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;
    resetDistrict();
    resetWard();
    setLocalFieldValue(FilterFieldName.City, finalOption);
    closeModal3();
  };

  const onChangeDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;
    resetWard();
    setLocalFieldValue(FilterFieldName.District, finalOption);
    closeModal3();
  };

  const onChangeWard = (option?: OptionForSelect) => {
    const finalOption = option?.value != 'all' ? option : undefined;
    setLocalFieldValue(FilterFieldName.Ward, finalOption);
    closeModal3();
  };

  return (
    <LocationsPicker
      openModal={openModal3}
      city={city} district={district} ward={ward}
      onChangeCity={onChangeCity}
      onChangeDistrict={onChangeDistrict}
      onChangeWard={onChangeWard}
    />
  );
}
