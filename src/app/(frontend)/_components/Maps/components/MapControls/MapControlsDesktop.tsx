'use client';
import CurrentLocationBtn from './CurrentLocationBtn';
import { MapControlsProps } from '../../types';
import Autocomplete from '../Autocomplete';
import { OptionForSelect } from '@common/types';
import { useSetAtom } from 'jotai';
import { selectAutocompleteItemAtom } from '../../states/mapAtoms';
import { useMapPanningDesktop } from '../../hooks/useMapPanningDesktop';
import { TMapSetting } from '../../types';
import MapLogo from '@components/logo/map_logo';
import { Z_INDEX } from '../../constants';
import FilterOptions from './FilterOptions';

const MapControlsDesktop: React.FC<MapControlsProps> = ({
  onSearch,
  onLocationClick,
  onLayersClick: _onLayersClick,
  onFilterChange,
  className = '',
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const selectAutocompleteItem = useSetAtom(selectAutocompleteItemAtom);
  const { panToLocationSmart } = useMapPanningDesktop();

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
      {/* Google Maps Style Search & Filter - Fixed Top */}
      <div
        className={`fixed top-0 left-0 right-0 z-[${Z_INDEX.MAP_CONTROLS}] p-4 ${className}`}
      >
        <div className="flex gap-3 items-center">
          {/* Logo */}
          <MapLogo url='/' />

          {/* Search Bar */}
          <Autocomplete
            value={searchQuery}
            onChange={onSearchQueryChange}
            onSelect={handleAutocompleteSelect}
            onSubmit={handleSearchSubmit}
            placeholder="Tìm kiếm trên Google Maps"
          />

          {/* Filter Categories */}
          <FilterOptions onFilterChange={onFilterChange} />
        </div>
      </div>

      {/* Control Buttons - Right Side */}
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

export default MapControlsDesktop;
