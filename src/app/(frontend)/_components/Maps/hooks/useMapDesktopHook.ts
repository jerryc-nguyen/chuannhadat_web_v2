import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { LeafletMap, Marker } from '../types';
import { panToMarkerIfBehindPanel } from '../helpers/mapHelpers';
import useMapInteractionDesktopHook from './useMapInteractionDesktopHook';
import {
  mapAtom,
  selectedMarkerAtom,
  searchQueryAtom,
  markerClickAtom,
  clearSelectedMarkerAtom
} from '../states/mapAtoms';

export const useMapDesktopHook = () => {
  const router = useRouter();
  const [map, setMap] = useAtom(mapAtom);
  const [selectedMarker] = useAtom(selectedMarkerAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const handleMarkerClick = useSetAtom(markerClickAtom);
  const clearSelectedMarker = useSetAtom(clearSelectedMarkerAtom);
  const selectedMarkerRef = useRef<Marker | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    selectedMarkerRef.current = selectedMarker;
  }, [selectedMarker]);


  const handleMapReady = useCallback(async (mapInstance: unknown) => {
    const leafletMap = mapInstance as LeafletMap;
    setMap(leafletMap);

    // Add map click handler to close panel when clicking on map
    if (leafletMap) {
      try {
        leafletMap.on('click', (_e: unknown) => {
          // Close panel if it's currently open (using ref to avoid stale closure)
          if (selectedMarkerRef.current) {
            clearSelectedMarker();
          }
        });
      } catch (error) {
        console.warn('Error adding map click handler:', error);
      }
    }
  }, [clearSelectedMarker, setMap]);

  // Wire interaction handlers when map is ready
  useMapInteractionDesktopHook(map);

  // Listen for marker clicks from atoms and add panning logic
  useEffect(() => {
    if (selectedMarker && map) {
      // Pan map to center marker if it's behind the panel
      const location = {
        lat: selectedMarker.location.lat,
        lng: selectedMarker.location.lon
      };
      panToMarkerIfBehindPanel(map, location);
    }
  }, [selectedMarker, map]);

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
          map.setView([latitude, longitude], 15);
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

  return {
    // State
    map,
    selectedMarker,
    searchQuery,

    // Handlers
    setSearchQuery,
    setSelectedMarker: clearSelectedMarker,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleMarkerClick,
  };
};
