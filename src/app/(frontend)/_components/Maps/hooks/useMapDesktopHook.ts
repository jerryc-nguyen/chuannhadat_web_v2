import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { LeafletMap, Marker } from '../types';
import useMapInteractionHook from './useMapInteractionHook';
import { useMapFilters } from './useMapFilters';
import { useMapPanningDesktop } from './useMapPanningDesktop';
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

  // Global filter state management
  const { updateFilters } = useMapFilters();

  // Map panning functionality
  const { panToCurrentLocation, panToLocationSmart } = useMapPanningDesktop();

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
  useMapInteractionHook(map);

  const handleFilterChange = useCallback((filters: { businessType?: string; categoryType?: string }) => {
    updateFilters(filters);
  }, [updateFilters]);

  // Listen for marker clicks from atoms and add smart panning logic
  useEffect(() => {
    if (selectedMarker) {
      // Use smart panning to center marker in visible map area
      const location = {
        lat: selectedMarker.location.lat,
        lon: selectedMarker.location.lon
      };
      setTimeout(() => {
        panToLocationSmart(location, { animate: true, duration: 0.5 });
      }, 10);
    }
  }, [selectedMarker, panToLocationSmart]);

  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality here
    // You can integrate with your existing search API
  }, []);

  const handleLocationClick = useCallback(() => {
    panToCurrentLocation({ zoom: 17 });
  }, [panToCurrentLocation]);

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
    clearSelectedMarker,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleMarkerClick,
    handleFilterChange,
  };
};
