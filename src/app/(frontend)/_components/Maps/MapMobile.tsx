'use client';
import { useState, useCallback } from 'react';
import DynamicMap from './components/DynamicMap';
import MapControlsMobile from './components/MapControls/MapControlsMobile';
import { useRouter } from 'next/navigation';

const MapMobile: React.FC = () => {
  const router = useRouter();
  const [map, setMap] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMapReady = useCallback((mapInstance: unknown) => {
    setMap(mapInstance);
  }, []);

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality here
  }, []);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // @ts-ignore - Leaflet map instance has setView method
          (map as any).setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
        }
      );
    }
  }, [map]);

  const handleLayersClick = useCallback(() => {
    console.log('Layers clicked - functionality to be implemented');
  }, []);

  const handleNavigationClick = useCallback(() => {
    console.log('Navigation clicked - functionality to be implemented');
  }, []);

  const handleHomeClick = useCallback(() => {
    router.push('/');
  }, [router]);


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
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

    </div>
  );
};

export default MapMobile;
