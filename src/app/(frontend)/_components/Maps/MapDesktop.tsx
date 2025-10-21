'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsDesktop from './components/MapControls/MapControlsDesktop';
import InfoPanel from './components/InfoPanel';
import ListingPanel, { ListingOptionForSelect } from './components/ListingPanel';
import { useMapDesktopHook } from './hooks/useMapDesktopHook';
import { useWindowSize } from './hooks/useWindowSize';
import { useCurrentLocationMarker } from './hooks/useCurrentLocationMarker';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedAutocompleteItemAtom, clearSelectedAutocompleteItemAtom, markerClickAtom } from './states/mapAtoms';
import { LISTING_PANEL_WIDTH_WITH_PADDING, MAP_ZOOM_DEFAULT, Z_INDEX } from './constants';

const MapDesktop: React.FC = () => {
  const {
    searchQuery,

    // Handlers
    setSearchQuery,
    selectedMarker,
    clearSelectedMarker,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleFilterChange,
    map,
  } = useMapDesktopHook();

  // Manage current location marker
  useCurrentLocationMarker(map);

  // Listing panel state
  const selectedAutocompleteItem = useAtomValue(selectedAutocompleteItemAtom);
  const clearSelectedAutocompleteItem = useSetAtom(clearSelectedAutocompleteItemAtom);
  const handleMarkerClick = useSetAtom(markerClickAtom);

  // Window size for responsive layout
  const { width: windowWidth } = useWindowSize();

  const handleListingMarkerClick = (marker: any) => {
    // Don't clear the listing panel, show both panels side by side
    handleMarkerClick(marker);
  };

  // Calculate InfoPanel positioning when both panels are shown
  const shouldShowBothPanels = selectedAutocompleteItem && selectedMarker;

  // Check if screen is wide enough for dual panels
  // Need at least 1200px to comfortably show both panels (2 * 512px + some margin)
  const canShowBothPanels = windowWidth >= 1200;

  const infoPanelPosition = shouldShowBothPanels && canShowBothPanels ? 'left' : 'left';
  const infoPanelOffset = shouldShowBothPanels && canShowBothPanels ? LISTING_PANEL_WIDTH_WITH_PADDING + 10 : 0;

  // On smaller screens, if both panels should be shown, prioritize InfoPanel and hide ListingPanel
  const shouldShowListingPanel = selectedAutocompleteItem && (!selectedMarker || canShowBothPanels);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lon: 106.6297 }}
        zoom={MAP_ZOOM_DEFAULT}
        className={`h-full w-full z-[${Z_INDEX.MAP}]`}
        onMapReady={handleMapReady}
      />

      {/* Desktop Map Controls */}
      <MapControlsDesktop
        onSearch={handleSearch}
        onLocationClick={handleLocationClick}
        onLayersClick={handleLayersClick}
        onNavigationClick={handleNavigationClick}
        onHomeClick={handleHomeClick}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onFilterChange={handleFilterChange}
      />


      {/* Listing Panel (if location selected from autocomplete) */}
      {shouldShowListingPanel && (
        <ListingPanel
          listingOption={selectedAutocompleteItem as ListingOptionForSelect}
          onClose={() => clearSelectedAutocompleteItem()}
          onMarkerClick={handleListingMarkerClick}
        />
      )}

      {/* Professional Info Panel (if professional selected) */}
      {selectedMarker && (
        <InfoPanel
          marker={selectedMarker}
          onClose={() => clearSelectedMarker()}
          position={infoPanelPosition}
          offsetLeft={infoPanelOffset}
        />
      )}
    </div>
  );
};

export default MapDesktop;
