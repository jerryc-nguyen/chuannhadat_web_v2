'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsDesktop from './components/MapControls/MapControlsDesktop';
import InfoPanel from './components/InfoPanel';
import ListingPanel from './components/ListingPanel';
import { useMapDesktopHook } from './hooks/useMapDesktopHook';
import { useAtomValue, useSetAtom } from 'jotai';
import { selectedLocationAtom, clearSelectedLocationAtom, markerClickAtom } from './states/mapAtoms';

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
  } = useMapDesktopHook();

  // Listing panel state
  const selectedLocation = useAtomValue(selectedLocationAtom);
  const clearSelectedLocation = useSetAtom(clearSelectedLocationAtom);
  const handleMarkerClick = useSetAtom(markerClickAtom);

  const handleListingMarkerClick = (marker: any) => {
    // Clear the listing panel and show the marker info panel
    clearSelectedLocation();
    handleMarkerClick(marker);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lon: 106.6297 }}
        zoom={16}
        className="h-full w-full"
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


      {/* Professional Info Panel (if professional selected) */}
      {selectedMarker && !selectedLocation && (
        <InfoPanel
          marker={selectedMarker}
          onClose={() => clearSelectedMarker()}
        />
      )}

      {/* Listing Panel (if location selected from autocomplete) */}
      {selectedLocation && (
        <ListingPanel
          listingOption={selectedLocation}
          onClose={() => clearSelectedLocation()}
          onMarkerClick={handleListingMarkerClick}
        />
      )}
    </div>
  );
};

export default MapDesktop;
