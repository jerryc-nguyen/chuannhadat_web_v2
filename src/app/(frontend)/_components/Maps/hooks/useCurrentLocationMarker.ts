import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { currentLocationMarkerAtom } from '../states/mapAtoms';
import { LatLng } from '../types';

/**
 * Hook to manage the current location marker on the map
 * Integrates with the map instance when it's ready
 */
export const useCurrentLocationMarker = (map: any) => {
  const currentLocationMarker = useAtomValue(currentLocationMarkerAtom);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof window === 'undefined') return;

    const initializeMarker = async () => {
      try {
        const L = await import('leaflet');

        // Create custom icon for current location (blue dot)
        const currentLocationIcon = L.divIcon({
          html: `
            <div class="current-location-marker">
              <div class="current-location-dot"></div>
              <div class="current-location-ripple"></div>
            </div>
          `,
          className: 'current-location-marker-container',
          iconSize: [20, 20],
          iconAnchor: [10, 10], // Center the icon
        });

        // Create marker with custom icon
        const marker = L.marker([0, 0], {
          icon: currentLocationIcon,
          zIndexOffset: 1000, // Ensure it appears above other markers
        });

        // Add marker to map initially (visibility will be controlled separately)
        marker.addTo(map);
        markerRef.current = marker;

        // Optional: Add popup
        marker.bindPopup('Vị trí hiện tại của bạn');

      } catch (error) {
        console.error('Error creating current location marker:', error);
      }
    };

    initializeMarker();

    // Cleanup function
    return () => {
      if (markerRef.current && map) {
        try {
          map.removeLayer(markerRef.current);
        } catch (error) {
          console.warn('Error removing current location marker:', error);
        }
      }
    };
  }, [map]);

  // Update marker position when position changes
  useEffect(() => {
    if (markerRef.current && currentLocationMarker.position) {
      const { lat, lon } = currentLocationMarker.position;
      markerRef.current.setLatLng([lat, lon]);
    }
  }, [currentLocationMarker.position]);

  // Show/hide marker based on visibility
  useEffect(() => {
    if (!markerRef.current || !map) return;

    try {
      if (currentLocationMarker.isVisible) {
        if (!map.hasLayer(markerRef.current)) {
          markerRef.current.addTo(map);
        }
      } else {
        if (map.hasLayer(markerRef.current)) {
          map.removeLayer(markerRef.current);
        }
      }
    } catch (error) {
      console.warn('Error toggling current location marker visibility:', error);
    }
  }, [currentLocationMarker.isVisible, map]);

  return null; // This hook doesn't return anything, it just manages the marker
};
