import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';

import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import LocationsPicker from '@components/mobile-ui/LocationsPicker';
import { OptionForSelect } from '@common/types';
import { useCallback, useEffect } from 'react';
import useMainContentNavigator from '../hooks';
import { useLocationPicker } from '@contexts/LocationContext';
import LocationsAutocomplete from '@components/ajax-pickers/LocationsAutocomplete';
import RecentLocations from '@app/(frontend)/_components/features/navigation/main-content-navigator/RecentLocations';
import { useTrackAction } from '@common/hooks';
import { convertAutocompleteToFilterOption, useAutocompleteSearch } from '@app/(frontend)/_components/Maps/components/Autocomplete/hooks/useAutocompleteSearch';
import { useFilterState } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterState';

export default function MainContentNavigator({ openModal, closeModal }: { openModal: (modal: Modal) => void, closeModal: () => void }) {

  const { trackAction } = useTrackAction();
  const { recentSearches, loadRecentSearches } = useAutocompleteSearch();
  const { redirectToUrlWithNewFilters } = useFilterState();

  const {
    localCity,
    localDistrict,
    localWard,
    onSelectCity: originalOnSelectCity,
    onSelectDistrict: originalOnSelectDistrict,
    onSelectWard: originalOnSelectWard,
    onSubmit
  } = useMainContentNavigator();

  // Preload cities when this modal opens
  const { loadCities } = useLocationPicker();

  useEffect(() => {
    // Preload cities as soon as the location picker modal opens
    loadCities();
  }, [loadCities]);

  // Wrap the selection handlers to add the closeModal call
  const onSelectCity = useCallback((city?: OptionForSelect) => {
    const result = originalOnSelectCity(city);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectCity]);

  const onSelectDistrict = useCallback((district?: OptionForSelect) => {
    const result = originalOnSelectDistrict(district);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectDistrict]);

  const onSelectWard = useCallback((ward?: OptionForSelect) => {
    const result = originalOnSelectWard(ward);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectWard]);

  const handleSelectSearchLocation = (option: OptionForSelect) => {
    trackAction({ target_type: option.data_type || '', target_id: option.data?.id + '', action: 'view_map_object' });
    const filteredLocationState = convertAutocompleteToFilterOption(option);
    redirectToUrlWithNewFilters(filteredLocationState);
  };

  useEffect(() => {
    loadRecentSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className='my-4 ml-2'>
        <LocationsAutocomplete
          onSelect={handleSelectSearchLocation}
        />
      </div>

      <div className='ml-2'>
        <RecentLocations
          recentSearches={recentSearches}
          onSelect={handleSelectSearchLocation}
        />
      </div>

      <label className="text-sm text-gray-500 block mb-2 pl-3">
        Hoặc chọn từ danh sách
      </label>
      <LocationsPicker
        city={localCity}
        district={localDistrict}
        ward={localWard}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
        withStreet={false}
        openModal={openModal}
      />

      <DialogFooter className='mt-4'>
        <Button onClick={() => onSubmit()}>Áp dụng</Button>
      </DialogFooter>
    </div>
  );
}
