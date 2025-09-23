import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Professional } from '../types';
import { panToMarkerIfBehindPanel } from '../helpers/mapHelpers';

export const useMapDesktopHook = () => {
  const router = useRouter();
  const [map, setMap] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedProfessionalRef = useRef<Professional | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    selectedProfessionalRef.current = selectedProfessional;
  }, [selectedProfessional]);

  const handleMapReady = useCallback(async (mapInstance: unknown) => {
    setMap(mapInstance);

    // Add map click handler to close panel when clicking on map
    if (mapInstance) {
      try {
        // @ts-ignore - Leaflet map instance
        (mapInstance as any).on('click', (_e: any) => {
          // Close panel if it's currently open (using ref to avoid stale closure)
          if (selectedProfessionalRef.current) {
            setSelectedProfessional(null);
          }
        });
      } catch (error) {
        console.warn('Error adding map click handler:', error);
      }
    }
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

  const handleProfessionalClick = useCallback((professional: Professional) => {
    setSelectedProfessional(professional);

    // Pan map to center marker if it's behind the panel
    panToMarkerIfBehindPanel(map, professional.location);

    // You can navigate to professional detail page or show more info
  }, [map]);

  return {
    // State
    map,
    selectedProfessional,
    searchQuery,

    // Handlers
    setSearchQuery,
    setSelectedProfessional,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleProfessionalClick,
  };
};
