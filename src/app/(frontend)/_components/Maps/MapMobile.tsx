'use client';
import DynamicMap from './components/DynamicMap';
import MapControlsMobile from './components/MapControls/MapControlsMobile';
import InfoPanel from './components/InfoPanel/mobile';
import { useMapMobileHook } from './hooks/useMapMobileHook';

const MapMobile: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedMarker,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleFilterChange,
    handlePanelClose,
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

      {/* Info Panel Mobile (slidable bottom sheet) */}
      {selectedMarker && (
        <InfoPanel
          marker={selectedMarker}
          onClose={handlePanelClose}
        />
      )}

    </div>
  );
};

export default MapMobile;
