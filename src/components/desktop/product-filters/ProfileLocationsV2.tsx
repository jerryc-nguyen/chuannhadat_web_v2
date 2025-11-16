import { OptionForSelect } from '@common/types';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import LocationsList from '@components/desktop/components/LocationsList';
import { useFilterOperation } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterOperation';

export default function ProfileLocationsV2() {
  const {
    currentFilterState: filterState,
    localFilterState,
    setLocalFilterState
  } = useFilterOperation()

  const { locationsList } = useSearchAggs();
  const city = filterState.city;
  const district = filterState.district;
  const ward = filterState.ward;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetDistrict = () => {
    setLocalFilterState({ ...localFilterState, district: undefined })
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setLocalFilterState({ ...localFilterState, ward: undefined })
  };

  const onSelectCity = (city?: OptionForSelect) => {
    resetDistrict();
    resetWard();
    const finalOption = city?.value != 'all' ? city : undefined;
    setLocalFilterState({ ...localFilterState, city: finalOption });
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    resetWard();
    const finalOption = district?.value != 'all' ? district : undefined;
    setLocalFilterState({ ...localFilterState, district: finalOption });
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setLocalFilterState({ ...localFilterState, ward: finalOption });
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
