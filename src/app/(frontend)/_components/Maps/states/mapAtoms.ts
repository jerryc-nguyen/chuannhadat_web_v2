import { atom } from 'jotai';
import { LeafletMap, Marker } from '../types';
import { OptionForSelect } from '@common/types';
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
  (get, set, query: string) => {
    set(searchQueryAtom, query);
  }
);

// Action atoms for marker interactions
export const markerClickAtom = atom(
  null,
  (get, set, marker: Marker) => {
    console.log('markerClickAtom', marker);
    set(selectedMarkerAtom, marker);
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

// Selected autocomplete item atom - supports multiple types (MapSetting, User, etc.)
export const selectedAutocompleteItemAtom = atom<OptionForSelect | null>(null);

// Action atom for autocomplete selection - handles different data types
export const selectAutocompleteItemAtom = atom(
  null,
  (get, set, item: OptionForSelect) => {
    console.log('selectAutocompleteItemAtom', item);
    set(selectedAutocompleteItemAtom, item);

    // Handle different data types
    switch (item.data_type) {
      case 'MapSetting':
        // Handle map/location selection
        console.log('Selected location:', item);
        break;
      case 'User':
        // Handle user selection
        console.log('Selected user:', item);
        break;
      default:
        // Handle unknown types or fallback to location behavior
        console.log('Selected item (unknown type):', item);
        break;
    }
  }
);

// Clear selected autocomplete item atom
export const clearSelectedAutocompleteItemAtom = atom(
  null,
  (get, set) => {
    set(selectedAutocompleteItemAtom, null);
    set(searchQueryAtom, '');
  }
);

// Derived atoms for specific item types
export const selectedUserAtom = atom(
  (get) => {
    const item = get(selectedAutocompleteItemAtom);
    return item?.data_type === 'User' ? item : null;
  }
);

// Derived atom for MapSetting items (locations)
export const selectedMapSettingAtom = atom(
  (get) => {
    const item = get(selectedAutocompleteItemAtom);
    return item?.data_type === 'MapSetting' ? item : null;
  }
);

// Hover marker state
export const hoveredMarkerAtom = atom<Marker | null>(null);

// Set hovered marker atom
export const setHoveredMarkerAtom = atom(
  null,
  (get, set, marker: Marker | null) => {
    set(hoveredMarkerAtom, marker);
  }
);
