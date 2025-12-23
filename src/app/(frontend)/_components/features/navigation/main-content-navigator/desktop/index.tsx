import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@components/desktop/components/LocationsPicker';
import useMainContentNavigator from '../hooks';
import LocationsAutocomplete from '@components/ajax-pickers/LocationsAutocomplete';
import { OptionForSelect } from '@common/types';
import { ITrackActionPayload, useTrackAction } from '@common/hooks';
import { useAutocompleteSearch, convertAutocompleteToFilterOption } from '@frontend/Maps/components/Autocomplete/hooks/useAutocompleteSearch';
import { useEffect } from 'react';
import RecentLocations from '../RecentLocations';
import { useFilterState } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterState';

export default function MainContentNavigator() {
  const { trackAction } = useTrackAction();
  const { recentSearches, loadRecentSearches } = useAutocompleteSearch();
  const { redirectToUrlWithNewFilters } = useFilterState();

  const {
    localCity,
    localDistrict,
    localWard,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onSubmit,
    trackingParams
  } = useMainContentNavigator();

  const handleSelectSearchLocation = (option: OptionForSelect) => {
    trackAction({ target_type: option.data_type || '', target_id: option.data?.id + '', action: 'view_map_object' });
    const filteredLocationState = convertAutocompleteToFilterOption(option);
    redirectToUrlWithNewFilters(filteredLocationState);
  };

  const handleSubmit = () => {
    trackAction({ ...trackingParams as ITrackActionPayload, action: 'filter_by_location_picker' });
    onSubmit();
  };

  useEffect(() => {
    loadRecentSearches({ limit: 10, scope: 'category' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className='mb-4'>
        <label className="text-sm text-gray-500 block mb-2">
          Tìm kiếm nhanh
        </label>
        <LocationsAutocomplete
          onSelect={handleSelectSearchLocation}
        />
      </div>

      <RecentLocations
        recentSearches={recentSearches}
        onSelect={handleSelectSearchLocation}
      />

      <div className="space-y-2">
        <label className="text-sm text-gray-500 block mb-2">
          Hoặc chọn từ danh sách
        </label>
        <LocationsPicker
          city={localCity}
          district={localDistrict}
          ward={localWard}
          onChangeCity={onSelectCity}
          onChangeDistrict={onSelectDistrict}
          onChangeWard={onSelectWard}
        />
      </div>

      <DialogFooter className='mt-4'>
        <Button onClick={() => handleSubmit()}>Áp dụng</Button>
      </DialogFooter>
    </div>
  );
}
