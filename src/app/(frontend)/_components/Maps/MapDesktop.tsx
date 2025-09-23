'use client';
import { useState, useCallback } from 'react';
import DynamicMap from './components/DynamicMap';
import MapControlsDesktop from './components/MapControls/MapControlsDesktop';
import PropertyMarker from './components/PropertyMarker';
import { useRouter } from 'next/navigation';
import { Property } from './types';

// Sample property data
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

const MapDesktop: React.FC = () => {
  const router = useRouter();
  const [map, setMap] = useState<any>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleMapReady = useCallback((mapInstance: unknown) => {
    setMap(mapInstance);
  }, []);

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality here
    // You can integrate with your existing search API
  }, []);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // @ts-ignore - Leaflet map setView method
          (map as { setView: (coords: [number, number], zoom: number) => void }).setView([latitude, longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
        }
      );
    }
  }, [map]);

  const handleLayersClick = useCallback(() => {
    // Only one tile option available - no layer menu needed
    console.log('Single tile layer active');
  }, []);


  const handleNavigationClick = useCallback(() => {
    console.log('Navigation clicked');
    // Implement navigation functionality
  }, []);

  const handleHomeClick = useCallback(() => {
    router.push('/');
  }, [router]);

  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    console.log('Property clicked:', property);
    // You can navigate to property detail page or show more info
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full-screen map */}
      <DynamicMap
        center={{ lat: 10.8231, lng: 106.6297 }}
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



      {/* Property Info Panel (if property selected) */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-md">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{selectedProperty.title}</h3>
              <p className="text-xl font-bold text-blue-600 mb-2">{selectedProperty.price}</p>
              <p className="text-sm text-gray-600">
                {selectedProperty.type === 'sale' ? 'Bán' : 'Cho thuê'}
              </p>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Xem chi tiết
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
              Liên hệ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDesktop;
