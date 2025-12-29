import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@components/desktop/components/LocationsPicker';
import useMainContentNavigator from '../hooks';
import LocationsAutocomplete from '@components/ajax-pickers/LocationsAutocomplete';
import RecentLocations from '../RecentLocations';

export default function MainContentNavigator() {
  const {
    localCity,
    localDistrict,
    localWard,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    recentSearches,
    handleSelectSearchLocation,
    onDeleteRecentSearch,
    handleSubmit
  } = useMainContentNavigator();

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
        onDelete={onDeleteRecentSearch}
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
