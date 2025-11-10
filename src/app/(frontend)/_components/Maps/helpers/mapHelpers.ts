import { LatLng } from './markerHelper';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../constants';
import { LeafletMap } from '../types';

/**
 * Pans the map to center on a marker if it's behind the info panel
 * @param map - Leaflet map instance
 * @param markerLatLng - Marker coordinates to center on
 * @param animate - Whether to animate the pan (default: true)
 * @param duration - Animation duration in seconds (default: 0.5)
 */
import type { LatLngExpression } from 'leaflet';

// Type for Leaflet library
interface LeafletLib {
  latLng: (lat: number, lng: number) => LatLngExpression;
}

export const panToMarkerIfBehindPanel = (
  map: LeafletMap,
  markerLatLng: LatLng,
  animate = true,
  duration = 0.5
): void => {
  try {
    if (!map || typeof window === 'undefined' || !((window as { L?: LeafletLib }).L)) {
      return;
    }

    const L = (window as { L: LeafletLib }).L;
    const latLng = L.latLng(markerLatLng.lat, markerLatLng.lng);
    const markerPoint = map.latLngToContainerPoint(latLng);

    // Get map container dimensions
    // const mapContainer = map._container;
    // const containerRect = mapContainer.getBoundingClientRect();

    // Panel covers the left side of the screen (positioned at left-0)
    const panelWidth = SEARCH_BOX_WIDTH_WITH_PADDING;
    const isBehindPanel = markerPoint.x < panelWidth;

    // console.log('Marker position check:', {
    //   markerX: markerPoint.x,
    //   markerY: markerPoint.y,
    //   containerWidth: containerRect.width,
    //   panelWidth,
    //   isBehindPanel
    // });

    if (isBehindPanel) {
      console.log('Panning map to center marker');
      map.panTo(latLng, { animate, duration });
    }
  } catch (error) {
    console.warn('Error panning map:', error);
  }
};
