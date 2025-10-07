import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { LeafletMap, Marker, LatLng } from '../types';
import { selectedMarkerAtom, highlightMarkerLayerAtom } from '../states/mapAtoms';
import type { Layer } from 'leaflet';
import useResizeImage from '@common/hooks/useResizeImage';

// Helper function to create highlight marker
const createHighlightMarker = async (
  map: LeafletMap,
  marker: Marker,
  buildThumbnailUrl: (params: { imageUrl: string; width?: number; ratio?: number }) => string
): Promise<Layer> => {
  const L = await import('leaflet');
  const { lat, lon } = marker.location as LatLng;

  if (marker.marker_icon_url) {
    const iconUrl = buildThumbnailUrl({
      imageUrl: marker.marker_icon_url,
      width: 32,
      ratio: 1
    });

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
            border: 3px solid #ec4899;
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.4), 0 4px 8px rgba(0,0,0,0.4);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
          ${marker.marker_label ? `
            <div style="
              margin-top: 0px;
              padding: 2px 6px;
              background-color: transparent;
              color:rgb(10, 91, 241);
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
    const highlightMarker = L.circleMarker([lat, lon], {
      radius: 10,
      fillColor: '#ec4899',
      color: '#ec4899',
      weight: 3,
      opacity: 0.8,
      fillOpacity: 0.4
    });
    highlightMarker.addTo(map);
    return highlightMarker;
  }
};

export const useHighlightSelectedMarker = (map: LeafletMap | null) => {
  const selectedMarker = useAtomValue(selectedMarkerAtom);
  const [highlightLayer, setHighlightLayer] = useAtom(highlightMarkerLayerAtom);
  const { buildThumbnailUrl } = useResizeImage();

  // Manage highlight marker when selectedMarker changes
  useEffect(() => {
    if (!map) return;

    const updateHighlight = async () => {
      // Remove existing highlight layer
      if (highlightLayer) {
        try {
          map.removeLayer(highlightLayer);
        } catch (error) {
          console.debug('Error removing highlight layer:', error);
        }
        setHighlightLayer(null);
      }

      // Add new highlight if marker is selected
      if (selectedMarker) {
        try {
          const newHighlightLayer = await createHighlightMarker(map, selectedMarker, buildThumbnailUrl);
          setHighlightLayer(newHighlightLayer);
        } catch (error) {
          console.warn('Error creating highlight marker:', error);
        }
      }
    };

    updateHighlight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker, map]); // Only react to selectedMarker, map, and buildThumbnailUrl changes

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
