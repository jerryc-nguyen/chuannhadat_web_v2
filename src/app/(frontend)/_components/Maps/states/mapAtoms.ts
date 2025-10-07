import { atom } from 'jotai';
import { LeafletMap, Marker } from '../types';
import type { Layer } from 'leaflet';

// Map instance atom
export const mapAtom = atom<LeafletMap | null>(null);

// Selected marker atom
export const selectedMarkerAtom = atom<Marker | null>(null);

// Highlight marker layer atom - stores the Leaflet layer for the highlight marker
export const highlightMarkerLayerAtom = atom<Layer | null>(null);

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
    console.log('markerClickAtom', marker);
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

// Filter atoms for map markers
export const businessTypeFilterAtom = atom<string | null>(null);
export const categoryTypeFilterAtom = atom<string | null>(null);

// Future filter atoms for scalability
export const priceRangeFilterAtom = atom<{ min: number; max: number } | null>(null);
export const areaFilterAtom = atom<{ min: number; max: number } | null>(null);
export const bedroomFilterAtom = atom<number | null>(null);
export const directionFilterAtom = atom<string | null>(null);

// Combined filters atom for easy access
export const mapFiltersAtom = atom(
  (get) => ({
    businessType: get(businessTypeFilterAtom),
    categoryType: get(categoryTypeFilterAtom),
    priceRange: get(priceRangeFilterAtom),
    area: get(areaFilterAtom),
    bedroom: get(bedroomFilterAtom),
    direction: get(directionFilterAtom),
  })
);

// Clear all filters atom
export const clearAllFiltersAtom = atom(
  null,
  (get, set) => {
    set(businessTypeFilterAtom, null);
    set(categoryTypeFilterAtom, null);
    set(priceRangeFilterAtom, null);
    set(areaFilterAtom, null);
    set(bedroomFilterAtom, null);
    set(directionFilterAtom, null);
  }
);
