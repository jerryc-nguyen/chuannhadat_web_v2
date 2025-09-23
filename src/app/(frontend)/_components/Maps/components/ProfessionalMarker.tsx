'use client';
import { useEffect, useRef } from 'react';
import { Professional } from '../types';

interface ProfessionalMarkerProps {
  professional: Professional;
  map: unknown; // Leaflet map instance
  onClick?: (professional: Professional) => void;
}

const ProfessionalMarker: React.FC<ProfessionalMarkerProps> = ({
  professional,
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
            // Create custom icon based on professional type
            let iconColor = '#3b82f6'; // default blue
            let iconSymbol = '👤'; // default person

            switch (professional.type) {
              case 'broker':
                iconColor = '#10b981'; // green
                iconSymbol = '👔'; // briefcase person
                break;
              case 'company':
                iconColor = '#f59e0b'; // amber
                iconSymbol = '🏢'; // building
                break;
              case 'bank_assistant':
                iconColor = '#8b5cf6'; // purple
                iconSymbol = '💰'; // money bag
                break;
            }

            const iconHtml = `
              <div style="
                background-color: ${iconColor};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: white;
                position: relative;
              ">
                ${iconSymbol}
                ${professional.verified ? '<div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background: #10b981; border: 2px solid white; border-radius: 50%;"></div>' : ''}
              </div>
            `;

            const customIcon = L.divIcon({
              html: iconHtml,
              className: 'custom-professional-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            // Create marker
            const marker = L.marker([professional.location.lat, professional.location.lng], {
              icon: customIcon,
            });

            // Create popup content
            const ratingStars = professional.rating ? '★'.repeat(Math.floor(professional.rating)) + '☆'.repeat(5 - Math.floor(professional.rating)) : '';
            const typeLabel = {
              broker: 'Môi giới',
              company: 'Công ty',
              bank_assistant: 'Ngân hàng'
            }[professional.type];

            const _popupContent = `
              <div style="min-width: 220px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  ${professional.avatar ? `<img src="${professional.avatar}" alt="${professional.name}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 12px; object-fit: cover;" />` : '<div style="width: 40px; height: 40px; border-radius: 50%; background: #e5e7eb; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px;">👤</div>'}
                  <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${professional.name}</h3>
                    <p style="margin: 0; font-size: 12px; color: ${iconColor}; font-weight: 500;">${typeLabel}</p>
                  </div>
                </div>
                ${professional.company ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${professional.company}</p>` : ''}
                ${professional.rating ? `<div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="color: #fbbf24; font-size: 12px; margin-right: 4px;">${ratingStars}</span>
                  <span style="font-size: 12px; color: #6b7280;">(${professional.reviewCount || 0})</span>
                </div>` : ''}
                ${professional.specialty && professional.specialty.length > 0 ? `<p style="margin: 0; font-size: 11px; color: #6b7280;">${professional.specialty.slice(0, 2).join(', ')}</p>` : ''}
              </div>
            `;

            // marker.bindPopup(_popupContent); // Disabled marker popup

            // Add click handler
            marker.on('click', () => {
              if (onClick) {
                onClick(professional);
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
        console.error('Error adding professional marker:', error);
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
  }, [professional, map, onClick]);

  return null; // This component doesn't render anything directly
};

export default ProfessionalMarker;
