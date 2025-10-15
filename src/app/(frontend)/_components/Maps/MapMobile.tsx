'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsMobile from './components/MapControls/MapControlsMobile';
import InfoPanel from './components/InfoPanel/mobile';
import ListingPanel from './components/ListingPanel/mobile';
import { useMapMobileHook } from './hooks/useMapMobileHook';
import type { ListingOptionForSelect } from './components/ListingPanel/types';

const MapMobile: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMarker,
    selectedAutocompleteItem,
    clearSelectedAutocompleteItem,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleFilterChange,
    handleInfoPanelClose,
    handleListingMarkerClick,
  } = useMapMobileHook();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lon: 106.6297 }}
        zoom={13}
        className="h-full w-full"
        onMapReady={handleMapReady}
      />

      {/* Mobile Map Controls */}
      <MapControlsMobile
        onSearch={handleSearch}
        onLocationClick={handleLocationClick}
        onLayersClick={handleLayersClick}
        onNavigationClick={handleNavigationClick}
        onHomeClick={handleHomeClick}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Info Panel - highest priority on mobile */}
      {selectedMarker && (
        <InfoPanel
          marker={selectedMarker}
          onClose={handleInfoPanelClose}
        />
      )}

      {/* Listing Panel - only show when no marker is selected */}
      {!selectedMarker && selectedAutocompleteItem && (
        <ListingPanel
          listingOption={selectedAutocompleteItem as ListingOptionForSelect}
          onClose={clearSelectedAutocompleteItem}
          onMarkerClick={handleListingMarkerClick}
        />
      )}

    </div>
  );
};

export default MapMobile;
