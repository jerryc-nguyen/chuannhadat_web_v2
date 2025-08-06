import { FilterFieldName, OptionForSelect } from '@models';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import LocationsPicker from '@components/LocationsPicker';
import useSearchAggs from '@components/search-aggs/hooks';

export default function ProfileLocationsV1() {
  const { setLocalFieldValue, localFilterState } = useFilterState();
  const { profileLocationAgg } = useSearchAggs();
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
        city_ids={profileLocationAgg.city_ids}
        district_ids={profileLocationAgg.district_ids}
        ward_ids={profileLocationAgg.ward_ids}
        city_counts={profileLocationAgg.city_counts}
        district_counts={profileLocationAgg.district_count}
        ward_counts={profileLocationAgg.ward_counts}
      />
    </div>
  );
}
