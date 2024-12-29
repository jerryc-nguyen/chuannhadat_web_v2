import { FilterFieldName, OptionForSelect } from '@models';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import useSearchAggs from '@components/search-aggs/hooks';
import LocationsList from '@desktop/components/LocationsList';

export default function ProfileLocationsV2() {
  const { setLocalFieldValue, localFilterState, getLocalFieldValue } = useFilterState();
  const { locationsList } = useSearchAggs();
  const city = getLocalFieldValue(FilterFieldName.City);
  const district = getLocalFieldValue(FilterFieldName.District);
  const ward = getLocalFieldValue(FilterFieldName.Ward);

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
      <LocationsList
        city={city}
        district={district}
        ward={ward}
        cityOptions={[]}
        districtOptions={locationsList.districtOptions}
        wardOptions={locationsList.wardOptions}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
      />
    </div>
  );
}
