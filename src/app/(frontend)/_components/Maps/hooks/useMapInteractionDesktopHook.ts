import { useEffect, useRef, useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { mapsApi } from '../api';
import { Marker, LatLng, LeafletMap } from '../types';
import { markerClickAtom, businessTypeFilterAtom, categoryTypeFilterAtom } from '../states/mapAtoms';

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

// Helper function to fetch markers from API
const fetchMarkers = async (
  bounds: { north: number; south: number; east: number; west: number },
  filters: { businessType?: string | null; categoryType?: string | null },
  signal: AbortSignal
): Promise<Marker[]> => {
  const requestParams = {
    ...bounds,
    page: 1,
    per_page: 100,
    ...(filters.businessType && { business_type: filters.businessType }),
    ...(filters.categoryType && { category_type: filters.categoryType }),
  };

  const res = await mapsApi.markersByBounds(requestParams, { signal });
  const payload = res?.data ? { markers: res?.data?.users } : res?.data;
  return payload?.markers || [];
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
        marker = L.marker([lat, lon]);
      }

      marker.on('click', () => {
        onMarkerClick(item);
      });

      marker.addTo(group);
    }
  });

  group.addTo(map);
  return group;
};

// Helper function to check if error is cancellation/abort
const isCancellationError = (error: unknown) => {
  const errorObj = error as { name?: string; message?: string; status?: null | number; code?: string };

  if (errorObj?.name === 'CanceledError' || errorObj?.name === 'AbortError') return true;
  if (errorObj?.code === 'ERR_CANCELED' || errorObj?.code === 'ECONNABORTED') return true;
  if (errorObj?.message?.toLowerCase().includes('cancel')) return true;
  if (errorObj?.message?.toLowerCase().includes('abort')) return true;

  // Axios wraps aborted requests as "Network error" with status: null
  if (errorObj?.status === null && errorObj?.message?.includes('Network error')) {
    return true;
  }

  return false;
};

// Helper function to compare marker arrays for equality
const areMarkersEqual = (prevMarkers: Marker[], newMarkers: Marker[]): boolean => {
  if (prevMarkers.length !== newMarkers.length) return false;

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
  const isInitialMount = useRef(true);
  const { buildThumbnailUrl } = useResizeImage();
  const setMarkerClick = useSetAtom(markerClickAtom);

  // Read global filter state
  const businessType = useAtomValue(businessTypeFilterAtom);
  const categoryType = useAtomValue(categoryTypeFilterAtom);

  // Stable reference for marker click handler
  const stableMarkerClick = useRef((marker: Marker) => {
    isPanningRef.current = true; // Prevent moveend handler during pan
    setMarkerClick(marker);
  });

  // Reusable function to query and update markers
  const queryAndUpdateMarkers = useCallback(async () => {
    if (!map || typeof window === 'undefined') return;

    try {
      // Abort previous request
      if (markersAbortRef.current) {
        markersAbortRef.current.abort();
      }
      const controller = new AbortController();
      markersAbortRef.current = controller;

      // Fetch markers with current bounds and filters
      const bounds = getMapBounds(map);
      const markers = await fetchMarkers(bounds, { businessType, categoryType }, controller.signal);

      // Only update if markers changed
      const markersChanged = !areMarkersEqual(currentMarkersRef.current, markers);

      if (markersChanged) {
        // Clear existing markers
        if (markersLayerRef.current) {
          map.removeLayer(markersLayerRef.current);
        }

        // Add new markers
        const group = await createAndAddMarkers(map, markers, buildThumbnailUrl, stableMarkerClick.current);
        markersLayerRef.current = group;
        currentMarkersRef.current = markers;
      }

    } catch (error) {
      if (!isCancellationError(error)) {
        console.warn('Error fetching markers:', error);
      }
    }
  }, [map, businessType, categoryType, buildThumbnailUrl]);

  // Handle map moveend event
  const handleMapMoveEnd = useCallback(async () => {
    // Skip if panning from marker click
    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }

    await queryAndUpdateMarkers();
  }, [queryAndUpdateMarkers]);

  // Setup map moveend listener
  useEffect(() => {
    if (!map) return;

    // Load initial markers
    handleMapMoveEnd();
    map.on('moveend', handleMapMoveEnd);

    return () => {
      map.off('moveend', handleMapMoveEnd);

      // Cleanup on unmount only
      if (markersAbortRef.current) {
        markersAbortRef.current.abort();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]); // Only depend on map to prevent cleanup on filter changes

  // Re-query markers when filters change
  useEffect(() => {
    if (!map) return;

    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    queryAndUpdateMarkers();
  }, [businessType, categoryType, map, queryAndUpdateMarkers]);

  return {
    queryAndUpdateMarkers,
  };
};

export default useMapInteractionDesktopHook;
