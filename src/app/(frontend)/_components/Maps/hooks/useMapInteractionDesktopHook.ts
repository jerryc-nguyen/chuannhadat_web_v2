import { useEffect, useRef, useCallback } from 'react';
import { mapsApi } from '../api';
import { Marker, LatLng, LeafletMap } from '../types';

import type { Layer } from 'leaflet';

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
    try {
      map.removeLayer(layerRef.current);
    } catch (e) {
      console.warn('Failed removing previous markers layer:', e);
    }
    layerRef.current = null;
  }
};

// Helper function to create and add markers to map
const createAndAddMarkers = async (map: LeafletMap, markers: Marker[]): Promise<Layer> => {
  const L = await import('leaflet');
  const group = L.featureGroup();

  markers.forEach((item) => {
    const { lat, lon } = (item.location || {}) as LatLng;
    if (typeof lat === 'number' && typeof lon === 'number') {
      const marker = L.marker([lat, lon]);
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

export const useMapInteractionDesktopHook = (map: LeafletMap | null) => {
  const markersLayerRef = useRef<Layer | null>(null);
  const markersAbortRef = useRef<AbortController | null>(null);

  const handleMapMoveEnd = useCallback(async () => {
    if (!map || typeof window === 'undefined') return;

    try {
      // Get and log map bounds
      const bounds = getMapBounds(map);
      logBounds(bounds);

      // Abort previous request and create new one
      const controller = abortPreviousRequest(markersAbortRef);

      // Fetch markers from API
      const markers = await fetchMarkers(bounds, controller.signal);

      // Clear existing markers
      clearExistingMarkers(map, markersLayerRef);

      // Create and add new markers
      const group = await createAndAddMarkers(map, markers);
      markersLayerRef.current = group;

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
