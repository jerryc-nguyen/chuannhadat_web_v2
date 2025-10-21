'use client';
import { Button } from '@components/ui/button';
import { MapPin, Navigation, Home } from 'lucide-react';
import { MapControlsProps } from '../../types';
import Autocomplete from '../Autocomplete';
import { OptionForSelect } from '@common/types';
import { useSetAtom } from 'jotai';
import { selectAutocompleteItemAtom } from '../../states/mapAtoms';
import { useMapPanningMobile } from '../../hooks/useMapPanningMobile';
import { TMapSetting } from '../../types';
import MapLogo from '@components/logo/map_logo';
import MenubarIcon from '@app/(frontend)/_components/features/layout/mobile-header/MenubarIcon';
import { Z_INDEX } from '../../constants';

const MapControlsMobile: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick: _onLayersClick,
  onNavigationClick,
  onHomeClick,
  className = '',
  searchQuery = '',
  onSearchQueryChange,
}) => {

  const selectAutocompleteItem = useSetAtom(selectAutocompleteItemAtom);
  const { panToLocationSmart } = useMapPanningMobile();

  const handleAutocompleteSelect = (option: OptionForSelect) => {
    // Store the selected autocomplete item for listing panel
    selectAutocompleteItem(option);

    // Create a marker object from the autocomplete option
    if (option.data && option.data_type === 'MapSetting') {
      const markerData = option.data as unknown as TMapSetting;

      // Pan map to the selected location with smart centering
      panToLocationSmart(markerData.location, { animate: true, duration: 0.5 });
    }
  };

  const handleSearchSubmit = (queryOrEvent: string | React.FormEvent) => {
    if (typeof queryOrEvent === 'string') {
      // Direct query string from Autocomplete
      if (onSearch && queryOrEvent.trim()) {
        onSearch(queryOrEvent.trim());
      }
    } else {
      // Form event (legacy support)
      queryOrEvent.preventDefault();
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    }
  };

  return (
    <>
      {/* Mobile-Optimized Search & Filter Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-[${Z_INDEX.MAP_CONTROLS}] ${className}`}
      >
        {/* Search Bar with Logo and MenubarIcon */}
        <div className="p-2 flex items-center gap-1 shadow-sm">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <MapLogo url="/" />
          </div>

          {/* Autocomplete in the middle */}
          <div className="flex-grow">
            <Autocomplete
              value={searchQuery}
              onChange={onSearchQueryChange}
              onSelect={handleAutocompleteSelect}
              onSubmit={handleSearchSubmit}
              placeholder="Tìm kiếm địa điểm..."
            />
          </div>

          {/* MenubarIcon on the right */}
          <div className="flex-shrink-0 ml-1">
            <MenubarIcon isLogged={false} />
          </div>
        </div>
      </div>

      {/* Mobile Control Buttons - Bottom Right FAB Style */}
      <div className={`fixed bottom-6 right-4 z-[${Z_INDEX.MAP_CONTROLS}] flex flex-col gap-3`}>
        {/* Primary Action: My Location (Most Used) */}
        <Button
          variant="default"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl p-4 rounded-full w-14 h-14 transition-all duration-200 min-h-[56px] touch-manipulation"
          onClick={onLocationClick}
          title="Vị trí của tôi"
        >
          <MapPin className="h-6 w-6" />
        </Button>

        {/* Secondary Actions */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 p-3 rounded-full w-12 h-12 transition-all duration-200 min-h-[48px] touch-manipulation"
          onClick={onNavigationClick}
          title="Chỉ đường"
        >
          <Navigation className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="bg-white shadow-lg hover:shadow-xl hover:bg-gray-50 p-3 rounded-full w-12 h-12 transition-all duration-200 min-h-[48px] touch-manipulation"
          onClick={onHomeClick}
          title="Về trang chủ"
        >
          <Home className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </>
  );
};

export default MapControlsMobile;
