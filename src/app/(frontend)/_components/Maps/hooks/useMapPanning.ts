import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { mapAtom, setCurrentLocationMarkerAtom } from '../states/mapAtoms';
import { LatLng } from '../types';
import { toast } from 'sonner';

/**
 * Shared map panning functionality for both desktop and mobile platforms
 */
export const useMapPanning = () => {
  const map = useAtomValue(mapAtom);
  const setCurrentLocationMarker = useSetAtom(setCurrentLocationMarkerAtom);

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
   * Pan to current user location using geolocation
   */
  const panToCurrentLocation = useCallback((options?: { zoom?: number; platform?: 'desktop' | 'mobile' }) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    const { zoom, platform = 'desktop' } = options || {};

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lon: longitude };

        // Different zoom levels for different platforms
        const defaultZoom = platform === 'mobile' ? 16 : 22;

        panToLocation(
          userLocation,
          { zoom: zoom || defaultZoom, animate: true, duration: platform === 'mobile' ? 1.0 : 0.5 }
        );

        // Show current location marker
        setCurrentLocationMarker({
          position: userLocation,
          isVisible: true
        });

        if (platform === 'desktop') {
          toast.success('Đã chuyển đến vị trí của bạn');
        }
      },
      (error) => {
        console.warn('Error getting current location:', error);
        toast.error('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí của bạn.');
      }
    );
  }, [panToLocation, setCurrentLocationMarker]);

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
