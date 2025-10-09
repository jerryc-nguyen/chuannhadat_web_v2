import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mapAtom } from '../states/mapAtoms';
import { LatLng } from '../types';

/**
 * Custom hook for map panning functionality
 * Can be used in both mobile and desktop components
 */
export const useMapPanning = () => {
  const map = useAtomValue(mapAtom);

  /**
   * Pan the map to a specific location
   * @param location - The location to pan to (lat, lon)
   * @param options - Optional panning configuration
   */
  const panToLocation = useCallback((
    location: LatLng,
    options?: {
      animate?: boolean;
      duration?: number;
      zoom?: number;
    }
  ) => {
    if (!map) {
      console.warn('Map not available for panning');
      return;
    }

    const { lat, lon } = location;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      console.warn('Invalid location coordinates for panning:', location);
      return;
    }

    const panOptions = {
      animate: options?.animate !== false,
      duration: options?.duration || 0.5
    };

    // Pan to the location
    if (options?.zoom) {
      // Use setView if zoom level is specified
      map.setView([lat, lon], options.zoom, panOptions);
    } else {
      // Use panTo to maintain current zoom level
      map.panTo([lat, lon], panOptions);
    }

    console.log('🗺️ Panning map to location:', { lat, lon, options });
  }, [map]);

  /**
   * Pan to current user location
   */
  const panToCurrentLocation = useCallback((options?: { zoom?: number }) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        panToLocation(
          { lat: latitude, lon: longitude },
          { zoom: options?.zoom || 15 }
        );
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  }, [panToLocation]);

  /**
   * Check if map is available for panning
   */
  const isMapReady = useCallback(() => {
    return !!map;
  }, [map]);

  return {
    panToLocation,
    panToCurrentLocation,
    isMapReady,
  };
};
