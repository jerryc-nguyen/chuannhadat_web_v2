'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsDesktop from './components/MapControls/MapControlsDesktop';
import InfoPanel from './components/InfoPanel';
import { useMapDesktopHook } from './hooks/useMapDesktopHook';

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
      {selectedMarker && (
        <InfoPanel
          marker={selectedMarker}
          onClose={() => clearSelectedMarker()}
        />
      )}
    </div>
  );
};

export default MapDesktop;
