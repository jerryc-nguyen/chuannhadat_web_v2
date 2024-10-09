import { FilterFieldName, OptionForSelect } from '@models';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import LocationsPicker from '@desktop/components/LocationsPicker';

export default function Locations() {
  const { setLocalFieldValue, localFilterState } = useFilterState();

  const city = localFilterState.city;
  const district = localFilterState.district;
  const ward = localFilterState.ward;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDistrict = () => {
    setLocalFieldValue(FilterFieldName.District, undefined);
    // trick to fix state not sync!!!
    localFilterState.district = undefined;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setLocalFieldValue(FilterFieldName.Ward, undefined);
    // trick to fix state not sync!!!
    localFilterState.ward = undefined;
  };

  const onSelectCity = (city?: OptionForSelect) => {
    resetDistrict();
    resetWard();
    const finalOption = city?.value != 'all' ? city : undefined;
    setLocalFieldValue(FilterFieldName.City, finalOption);
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    resetWard();

    const finalOption = district?.value != 'all' ? district : undefined;
    setLocalFieldValue(FilterFieldName.District, finalOption);
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setLocalFieldValue(FilterFieldName.Ward, finalOption);
  };

  return (
    <div>
      <LocationsPicker
        city={city}
        district={district}
        ward={ward}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
      />
    </div>
  );
}
