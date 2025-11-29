import React, { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { LeafletMap, Marker, LatLng } from '../types';
import { selectedMarkerAtom, highlightMarkerLayerAtom, hoveredMarkerAtom } from '../states/mapAtoms';
import type { Layer } from 'leaflet';
import useResizeImage from '@common/hooks/useResizeImage';

// Helper function to create highlight marker
const createHighlightMarker = async (
  map: LeafletMap,
  marker: Marker,
  buildThumbnailUrl: (params: { imageUrl: string; width?: number; ratio?: number }) => string,
  isHovered = false
): Promise<Layer> => {
  const L = await import('leaflet');
  const { lat, lon } = marker.location as LatLng;

  if (marker.marker_icon_url) {
    const iconUrl = buildThumbnailUrl({
      imageUrl: marker.marker_icon_url,
      width: 32,
      ratio: 1
    });

    // Different styles for selected vs hovered
    const borderColor = isHovered ? '#3b82f6' : '#ec4899'; // Blue for hover, Pink for selected
    const shadowColor = isHovered ? 'rgba(59, 130, 246, 0.4)' : 'rgba(236, 72, 153, 0.4)';
    const labelColor = isHovered ? '#3b82f6' : '#ec4899';
    const animation = isHovered ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';

    const highlightIcon = L.divIcon({
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-image: url('${iconUrl}');
            background-size: cover;
            background-position: center;
            border: 3px solid ${borderColor};
            box-shadow: 0 0 0 4px ${shadowColor}, 0 4px 8px rgba(0,0,0,0.4);
            animation: ${animation};
          "></div>
          ${marker.marker_label ? `
            <div style="
              margin-top: 0px;
              padding: 2px 6px;
              background-color: transparent;
              color: ${labelColor};
              font-size: 11px;
              font-weight: 700;
              border-radius: 4px;
              white-space: nowrap;
              text-align: center;
              text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
            ">${marker.marker_label}</div>
          ` : ''}
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        </style>
      `,
      className: 'custom-highlight-marker',
      iconSize: [32, marker.marker_label ? 50 : 32],
      iconAnchor: [16, marker.marker_label ? 25 : 16]
    });

    const highlightMarker = L.marker([lat, lon], { icon: highlightIcon });
    highlightMarker.addTo(map);
    return highlightMarker;
  } else {
    // For default markers, create a circle marker with highlight
    const fillColor = isHovered ? '#3b82f6' : '#ec4899'; // Blue for hover, Pink for selected
    const highlightMarker = L.circleMarker([lat, lon], {
      radius: 10,
      fillColor: fillColor,
      color: fillColor,
      weight: 3,
      opacity: 0.8,
      fillOpacity: 0.4
    });
    highlightMarker.addTo(map);
    return highlightMarker;
  }
};

export const useHighlightSelectedMarker = (map: LeafletMap | null, isHighlightingRef?: React.MutableRefObject<boolean>) => {
  const selectedMarker = useAtomValue(selectedMarkerAtom);
  const hoveredMarker = useAtomValue(hoveredMarkerAtom);
  const [highlightLayer, setHighlightLayer] = useAtom(highlightMarkerLayerAtom);
  const { buildThumbnailUrl } = useResizeImage();

  // Manage highlight marker when selectedMarker or hoveredMarker changes
  useEffect(() => {
    if (!map) return;

    const updateHighlight = async () => {
      // Set highlighting flag to prevent map event triggers
      if (isHighlightingRef) {
        isHighlightingRef.current = true;
        console.log('🎯 Setting highlighting flag to TRUE');
      } else {
        console.log('⚠️ isHighlightingRef not available - flag not set');
      }

      try {
        // Remove existing highlight layer
        if (highlightLayer) {
          try {
            map.removeLayer(highlightLayer);
          } catch (error) {
            console.debug('Error removing highlight layer:', error);
          }
          setHighlightLayer(null);
        }

        // Determine which marker to highlight (prioritize selected over hovered)
        const markerToHighlight = selectedMarker || hoveredMarker;
        const isHovered = !selectedMarker && !!hoveredMarker;

        // Add new highlight if there's a marker to highlight
        if (markerToHighlight) {
          try {
            const newHighlightLayer = await createHighlightMarker(map, markerToHighlight, buildThumbnailUrl, isHovered);
            setHighlightLayer(newHighlightLayer);
          } catch (error) {
            console.warn('Error creating highlight marker:', error);
          }
        }
      } finally {
        // Reset highlighting flag after operations complete
        // Use requestAnimationFrame to ensure DOM updates are processed
        if (isHighlightingRef) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isHighlightingRef.current = false;
              console.log('🎯 Reset highlighting flag to FALSE');
            });
          });
        }
      }
    };

    updateHighlight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker, hoveredMarker, map]); // React to selectedMarker, hoveredMarker, and map changes

  // Cleanup highlight layer on unmount
  useEffect(() => {
    if (!map) return;

    return () => {
      if (highlightLayer) {
        try {
          map.removeLayer(highlightLayer);
        } catch (error) {
          console.debug('Error removing highlight layer on unmount:', error);
        }
      }
    };
  }, [map, highlightLayer]);
};
