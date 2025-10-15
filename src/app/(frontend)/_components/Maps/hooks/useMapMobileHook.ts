import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom, useSetAtom } from 'jotai';
import { LeafletMap, Marker } from '../types';
import useMapInteractionDesktopHook from './useMapInteractionDesktopHook';
import { useMapFilters } from './useMapFilters';
import { useMapPanningMobile } from './useMapPanningMobile';
import {
  mapAtom,
  selectedMarkerAtom,
  searchQueryAtom,
  markerClickAtom,
  clearSelectedMarkerAtom,
  selectedAutocompleteItemAtom,
  clearSelectedAutocompleteItemAtom,
  setHoveredMarkerAtom,
} from '../states/mapAtoms';

export const useMapMobileHook = () => {
  const router = useRouter();
  const [map, setMap] = useAtom(mapAtom);
  const [selectedMarker] = useAtom(selectedMarkerAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedAutocompleteItem] = useAtom(selectedAutocompleteItemAtom);
  const handleMarkerClick = useSetAtom(markerClickAtom);
  const clearSelectedMarker = useSetAtom(clearSelectedMarkerAtom);
  const clearSelectedAutocompleteItem = useSetAtom(clearSelectedAutocompleteItemAtom);
  const setHoveredMarker = useSetAtom(setHoveredMarkerAtom);
  const selectedMarkerRef = useRef<Marker | null>(null);

  // Global filter state management
  const { updateFilters } = useMapFilters();

  // Map panning functionality
  const {
    panToCurrentLocation,
    panToLocationSmart,
    isMarkerInMapBounds,
    isMarkerBehindPanels
  } = useMapPanningMobile();

  // Keep ref in sync with state
  useEffect(() => {
    selectedMarkerRef.current = selectedMarker;
  }, [selectedMarker]);

  const handleMapReady = useCallback(async (mapInstance: unknown) => {
    const leafletMap = mapInstance as LeafletMap;
    setMap(leafletMap);

    // Add map click handler to close panels when clicking on map
    if (leafletMap) {
      try {
        leafletMap.on('click', (_e: unknown) => {
          // Close panels if they're currently open (using ref to avoid stale closure)
          if (selectedMarkerRef.current) {
            clearSelectedMarker();
          }
        });
      } catch (error) {
        console.warn('Error adding map click handler:', error);
      }
    }
  }, [clearSelectedMarker, setMap]);

  // Wire interaction handlers when map is ready - This enables marker loading on pan/zoom
  useMapInteractionDesktopHook(map);

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
    panToCurrentLocation(); // Uses mobile-optimized zoom level (16)
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

  const handleFilterChange = useCallback((filters: { businessType?: string; categoryType?: string }) => {
    updateFilters(filters);
  }, [updateFilters]);

  // Mobile-specific handlers
  const handleMarkerClickMobile = useCallback((marker: Marker) => {
    // On mobile, clicking a marker should show the info panel
    handleMarkerClick(marker);
  }, [handleMarkerClick]);

  // Handle panel close (closes both info and listing panels)
  const handlePanelClose = useCallback(() => {
    clearSelectedMarker();
    clearSelectedAutocompleteItem();
  }, [clearSelectedMarker, clearSelectedAutocompleteItem]);

  // Handle marker click from listing panel (opens info panel)
  const handleListingMarkerClick = useCallback((marker: Marker) => {
    handleMarkerClick(marker);
    // Optionally close listing panel when opening info panel
    // clearSelectedAutocompleteItem();
  }, [handleMarkerClick]);

  const handleMarkerHover = useCallback((marker: Marker | null) => {
    setHoveredMarker(marker);
  }, [setHoveredMarker]);

  return {
    // State
    map,
    selectedMarker,
    selectedAutocompleteItem,
    searchQuery,

    // Handlers
    setSearchQuery,
    clearSelectedMarker,
    clearSelectedAutocompleteItem,
    handleMapReady,
    handleSearch,
    handleLocationClick,
    handleLayersClick,
    handleNavigationClick,
    handleHomeClick,
    handleMarkerClick: handleMarkerClickMobile,
    handleListingMarkerClick,
    handleFilterChange,
    handlePanelClose,
    handleMarkerHover,

    // Marker utilities
    isMarkerInMapBounds,
    isMarkerBehindPanels,
  };
};
