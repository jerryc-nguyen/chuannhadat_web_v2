import { useEffect, useRef, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { mapsApi } from '../api';
import { Marker, LatLng, LeafletMap } from '../types';
import { markerClickAtom } from '../states/mapAtoms';

import type { Layer } from 'leaflet';
import useResizeImage from '@common/hooks/useResizeImage';

// Helper function to get map bounds
const getMapBounds = (map: LeafletMap) => {
  const bounds = map.getBounds();
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
  };
};

// Helper function to log bounds
const logBounds = (bounds: { north: number; south: number; east: number; west: number }) => {
  console.log('North:', bounds.north);
  console.log('South:', bounds.south);
  console.log('East:', bounds.east);
  console.log('West:', bounds.west);
};

// Helper function to abort previous request
const abortPreviousRequest = (abortRef: React.MutableRefObject<AbortController | null>) => {
  if (abortRef.current) {
    try {
      abortRef.current.abort();
    } catch (error) {
      // Ignore abort errors - they're expected when cancelling requests
      console.debug('Request abort error (expected):', error);
    }
  }
  const controller = new AbortController();
  abortRef.current = controller;
  return controller;
};

// Helper function to fetch markers from API
const fetchMarkers = async (
  bounds: { north: number; south: number; east: number; west: number },
  signal: AbortSignal
): Promise<Marker[]> => {
  const res = await mapsApi.markersByBounds(
    { ...bounds, page: 1, per_page: 100 },
    { signal }
  );
  const payload = res?.data ? { markers: res?.data?.users } : res?.data;
  return payload?.markers || [];
};

// Helper function to clear existing markers
const clearExistingMarkers = (map: LeafletMap, layerRef: React.MutableRefObject<Layer | null>) => {
  if (layerRef.current) {
    console.log('🧹 CLEARING MARKERS - This should not happen after marker click!');
    console.trace('Stack trace for marker clearing:');
    try {
      map.removeLayer(layerRef.current);
    } catch (e) {
      console.warn('Failed removing previous markers layer:', e);
    }
    layerRef.current = null;
  }
};

// Helper function to create and add markers to map
const createAndAddMarkers = async (
  map: LeafletMap,
  markers: Marker[],
  buildThumbnailUrl: (params: { imageUrl: string; width?: number; ratio?: number }) => string,
  onMarkerClick: (marker: Marker) => void
): Promise<Layer> => {
  const L = await import('leaflet');
  const group = L.featureGroup();

  markers.forEach((item) => {
    const { lat, lon } = (item.location || {}) as LatLng;
    if (typeof lat === 'number' && typeof lon === 'number') {
      let marker;

      // Create custom icon if marker_icon_url is provided
      if (item.marker_icon_url) {
        const iconUrl = buildThumbnailUrl({
          imageUrl: item.marker_icon_url,
          width: 32,
          ratio: 1
        });

        // Create a round icon using divIcon with custom HTML and label
        const customIcon = L.divIcon({
          html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-image: url('${iconUrl}');
                background-size: cover;
                background-position: center;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
              ${item.marker_label ? `
                <div style="
                  margin-top: 0px;
                  padding: 2px 6px;
                  background-color: transparent;
                  color: red;
                  font-size: 11px;
                  font-weight: 600;
                  border-radius: 4px;
                  white-space: nowrap;
                  text-align: center;
                  text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
                ">${item.marker_label}</div>
              ` : ''}
            </div>
          `,
          className: 'custom-round-marker',
          iconSize: [32, item.marker_label ? 50 : 32],
          iconAnchor: [16, item.marker_label ? 25 : 16]
        });

        marker = L.marker([lat, lon], { icon: customIcon });
      } else {
        // Use default marker if no custom icon
        marker = L.marker([lat, lon]);
      }

      // Handle marker click using Jotai atom
      marker.on('click', () => {
        onMarkerClick(item);
      });

      marker.addTo(group);
    }
  });

  group.addTo(map);
  return group;
};

// Helper function to check if error is cancellation
const isCancellationError = (error: unknown) => {
  return (error as { name?: string })?.name === 'CanceledError' ||
    (error as { name?: string })?.name === 'AbortError';
};

// Helper function to compare marker arrays for equality
const areMarkersEqual = (prevMarkers: Marker[], newMarkers: Marker[]): boolean => {
  if (prevMarkers.length !== newMarkers.length) return false;

  // Simple comparison by IDs and positions
  for (let i = 0; i < prevMarkers.length; i++) {
    const prev = prevMarkers[i];
    const curr = newMarkers[i];

    if (prev.id !== curr.id ||
      prev.location.lat !== curr.location.lat ||
      prev.location.lon !== curr.location.lon) {
      return false;
    }
  }

  return true;
};

export const useMapInteractionDesktopHook = (map: LeafletMap | null) => {
  const markersLayerRef = useRef<Layer | null>(null);
  const markersAbortRef = useRef<AbortController | null>(null);
  const currentMarkersRef = useRef<Marker[]>([]);
  const isPanningRef = useRef(false);
  const { buildThumbnailUrl } = useResizeImage();
  const setMarkerClick = useSetAtom(markerClickAtom);


  // Stable reference to prevent marker re-creation
  const stableMarkerClick = useRef((marker: Marker) => {
    setMarkerClick(marker);
  });

  // Update the ref when setMarkerClick changes
  stableMarkerClick.current = (marker: Marker) => {
    isPanningRef.current = true; // Set flag to prevent moveend handling
    setMarkerClick(marker);
  };

  const handleMapMoveEnd = useCallback(async () => {
    if (!map || typeof window === 'undefined') return;

    // Skip if we're panning due to marker click
    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }

    try {
      // Get and log map bounds
      const bounds = getMapBounds(map);
      logBounds(bounds);

      // Abort previous request and create new one
      const controller = abortPreviousRequest(markersAbortRef);

      // Fetch markers from API
      const markers = await fetchMarkers(bounds, controller.signal);

      // Only recreate markers if the data actually changed
      const markersChanged = !areMarkersEqual(currentMarkersRef.current, markers);

      if (markersChanged) {
        // Clear existing markers
        clearExistingMarkers(map, markersLayerRef);

        // Create and add new markers
        const group = await createAndAddMarkers(map, markers, buildThumbnailUrl, stableMarkerClick.current);
        markersLayerRef.current = group;
        currentMarkersRef.current = markers;
      }

    } catch (error) {
      if (isCancellationError(error)) return;
      console.warn('Markers handling error:', error);
    }
  }, [map]);


  useEffect(() => {
    if (!map) return;

    // Initial render and subscribe to moveend
    handleMapMoveEnd();
    map.on('moveend', handleMapMoveEnd);

    return () => {
      // Cleanup
      try {
        map.off('moveend', handleMapMoveEnd);
      } catch (error) {
        console.debug('Error removing map event listener:', error);
      }

      if (markersAbortRef.current) {
        try {
          markersAbortRef.current.abort();
        } catch (error) {
          console.debug('Error aborting request:', error);
        }
        markersAbortRef.current = null;
      }

      if (markersLayerRef.current) {
        try {
          map.removeLayer(markersLayerRef.current);
        } catch (error) {
          console.debug('Error removing markers layer:', error);
        }
        markersLayerRef.current = null;
      }
    };
  }, [map, handleMapMoveEnd]);
};

export default useMapInteractionDesktopHook;
