'use client';
import { useEffect, useRef } from 'react';
import { Property } from '../types';

interface PropertyMarkerProps {
  property: Property;
  map: unknown; // Leaflet map instance
  onClick?: (property: Property) => void;
}

const PropertyMarker: React.FC<PropertyMarkerProps> = ({
  property,
  map,
  onClick,
}) => {
  const markerRef = useRef<unknown>(null);

  useEffect(() => {
    const addMarker = async () => {
      if (!map || typeof window === 'undefined') return;

      // Prevent duplicate markers
      if (markerRef.current) {
        try {
          // @ts-ignore - Leaflet map methods
          (map as any).removeLayer(markerRef.current);
        } catch (error) {
          console.warn('Error removing existing marker:', error);
        }
        markerRef.current = null;
      }

      try {
        const L = await import('leaflet');

        // Wait for map to be ready
        // @ts-ignore - Leaflet map methods
        (map as any).whenReady(() => {
          try {
            // Create custom icon based on property type
            const iconColor = property.type === 'sale' ? '#ef4444' : '#3b82f6';
            const iconHtml = `
              <div style="
                background-color: ${iconColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: white;
                font-weight: bold;
              ">
                ${property.type === 'sale' ? '$' : 'R'}
              </div>
            `;

            const customIcon = L.divIcon({
              html: iconHtml,
              className: 'custom-property-marker',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            });

            // Create marker
            const marker = L.marker([property.location.lat, property.location.lng], {
              icon: customIcon,
            });

            // Create popup content
            const popupContent = `
              <div style="min-width: 200px;">
                ${property.image ? `<img src="${property.image}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${property.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: ${iconColor};">${property.price}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">${property.type === 'sale' ? 'Bán' : 'Cho thuê'}</p>
              </div>
            `;

            marker.bindPopup(popupContent);

            // Add click handler
            marker.on('click', () => {
              if (onClick) {
                onClick(property);
              }
            });

            // Add marker to map
            // @ts-ignore - Leaflet map methods
            marker.addTo(map as any);

            markerRef.current = marker;

          } catch (error) {
            console.error('Error creating marker:', error);
          }
        });

      } catch (error) {
        console.error('Error adding property marker:', error);
      }
    };

    // Add a small delay to ensure map is ready
    const timeoutId = setTimeout(addMarker, 200);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (markerRef.current && map) {
        try {
          // @ts-ignore - Leaflet map methods
          (map as any).removeLayer(markerRef.current);
        } catch (error) {
          console.warn('Error removing marker on cleanup:', error);
        }
        markerRef.current = null;
      }
    };
  }, [property, map, onClick]);

  return null; // This component doesn't render anything directly
};

export default PropertyMarker;
