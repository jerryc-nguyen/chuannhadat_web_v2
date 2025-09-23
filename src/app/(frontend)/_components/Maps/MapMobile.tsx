'use client';
import { useState, useCallback } from 'react';
import DynamicMap from './components/DynamicMap';
import MapControlsMobile from './components/MapControlsMobile';
import PropertyMarker from './components/PropertyMarker';
import { useRouter } from 'next/navigation';
import { Property } from './types';

// Sample property data (same as desktop)
const sampleProperties = [
  {
    id: '1',
    title: 'Căn hộ cao cấp Vinhomes Central Park',
    price: '5.2 tỷ',
    location: { lat: 10.8231, lng: 106.6297 },
    type: 'sale' as const,
    image: 'https://images.chuannhadat.com/images/default-image.jpg',
  },
  {
    id: '2',
    title: 'Nhà phố Thảo Điền cho thuê',
    price: '25 triệu/tháng',
    location: { lat: 10.8331, lng: 106.6397 },
    type: 'rent' as const,
    image: 'https://images.chuannhadat.com/images/default-image.jpg',
  },
  {
    id: '3',
    title: 'Biệt thự Phú Mỹ Hưng',
    price: '12 tỷ',
    location: { lat: 10.8131, lng: 106.6197 },
    type: 'sale' as const,
    image: 'https://images.chuannhadat.com/images/default-image.jpg',
  },
];

const MapMobile: React.FC = () => {
  const router = useRouter();
  const [map, setMap] = useState<unknown>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lng: 106.6297 }}
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
      />

      {/* Property Markers */}
      {map && sampleProperties.map((property) => (
        <PropertyMarker
          key={`marker-${property.id}`}
          property={property}
          map={map}
          onClick={handlePropertyClick}
        />
      ))}

      {/* Mobile Property Info Panel */}
      {selectedProperty && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-[1000] p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{selectedProperty.title}</h3>
              <p className="text-xl font-bold text-blue-600 mb-1">{selectedProperty.price}</p>
              <p className="text-sm text-gray-600">
                {selectedProperty.type === 'sale' ? 'Bán' : 'Cho thuê'}
              </p>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium">
              Xem chi tiết
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium">
              Liên hệ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapMobile;
