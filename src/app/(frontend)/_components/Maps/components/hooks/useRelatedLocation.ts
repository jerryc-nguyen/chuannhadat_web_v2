import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { markerClickAtom, mapAtom } from '../../states/mapAtoms';
import { Marker } from '../../types';

export const useRelatedLocation = () => {
  const handleMarkerClick = useSetAtom(markerClickAtom);
  const map = useAtomValue(mapAtom);

  return useCallback((selectedMarker: Marker) => {
    // Update selected marker
    handleMarkerClick(selectedMarker);

    // Always pan to the new marker location
    if (map) {
      const location = [selectedMarker.location.lat, selectedMarker.location.lon] as [number, number];
      map.panTo(location, { animate: true, duration: 0.5 });
    }
  }, [handleMarkerClick, map]);
};
