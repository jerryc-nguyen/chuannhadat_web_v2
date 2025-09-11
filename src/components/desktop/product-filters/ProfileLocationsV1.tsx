import { FilterFieldName, OptionForSelect } from '@common/models';
import useFilterState from '@frontend/CategoryPage/mobile/filter_bds/hooks/useFilterState';
// LocationsPicker component removed - using LocationContext directly
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';

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
      {/* LocationsPicker removed - implement using LocationContext directly */}
      <div className="text-gray-500 p-4">
        Location picker component removed. Please implement using LocationContext.
      </div>
    </div>
  );
}
