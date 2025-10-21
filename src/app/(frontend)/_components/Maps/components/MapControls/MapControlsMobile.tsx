'use client';
import CurrentLocationBtn from './CurrentLocationBtn';
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
      <div className={`fixed z-[${Z_INDEX.MAP_CONTROLS}] flex flex-col gap-3`} style={{ bottom: '100px', right: '10px' }}>
        {/* My Location Button */}
        <CurrentLocationBtn
          onClick={onLocationClick}
          size="md"
          variant="desktop"
        />
      </div>
    </>
  );
};

export default MapControlsMobile;
