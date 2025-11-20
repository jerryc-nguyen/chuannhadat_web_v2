'use client';

import { useEffect, useRef } from 'react';
import { LatLng } from '../types';

/**
 * Props for the CurrentLocationMarker component
 */
interface CurrentLocationMarkerProps {
  position: LatLng;
  map: any; // Leaflet map instance
  isVisible?: boolean;
}

/**
 * Current Location Marker with Google Maps-style animated pulsing dot
 * Features:
 * - Blue pulsing dot with ripple animation
 * - Custom icon similar to Google Maps
 * - Smooth animations
 * - Proper cleanup
 */
const CurrentLocationMarker: React.FC<CurrentLocationMarkerProps> = ({
  position,
  map,
  isVisible = true,
}) => {
  const markerRef = useRef<any>(null);
  const rippleRef = useRef<any>(null);

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
        const marker = L.marker([position.lat, position.lon], {
          icon: currentLocationIcon,
          zIndexOffset: 1000, // Ensure it appears above other markers
        });

        // Add marker to map if visible
        if (isVisible) {
          marker.addTo(map);
        }

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
    if (markerRef.current && position) {
      markerRef.current.setLatLng([position.lat, position.lon]);
    }
  }, [position]);

  // Show/hide marker based on visibility
  useEffect(() => {
    if (!markerRef.current || !map) return;

    try {
      if (isVisible) {
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
  }, [isVisible, map]);

  // This component doesn't render anything directly - it manages the Leaflet marker
  return null;
};

export default CurrentLocationMarker;
