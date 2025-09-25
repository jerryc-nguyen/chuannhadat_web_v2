import { atom } from 'jotai';
import { LeafletMap, Marker } from '../types';

// Map instance atom
export const mapAtom = atom<LeafletMap | null>(null);

// Selected marker atom
export const selectedMarkerAtom = atom<Marker | null>(null);

// Search query atom
export const searchQueryAtom = atom<string>('');

// Derived atom for search query with marker name
export const searchQueryWithMarkerAtom = atom(
  (get) => get(searchQueryAtom),
  (get, set, update: string | Marker) => {
    if (typeof update === 'string') {
      set(searchQueryAtom, update);
    } else {
      // If it's a marker, use its label or a default name
      const markerName = update.marker_label || `Marker ${update.id}`;
      set(searchQueryAtom, markerName);
      set(selectedMarkerAtom, update);
    }
  }
);

// Action atoms for marker interactions
export const markerClickAtom = atom(
  null,
  (get, set, marker: Marker) => {
    set(selectedMarkerAtom, marker);
    set(searchQueryWithMarkerAtom, marker);
  }
);

export const clearSelectedMarkerAtom = atom(
  null,
  (get, set) => {
    set(selectedMarkerAtom, null);
  }
);
