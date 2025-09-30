// Import Leaflet Map type
import type { Map as LeafletMap } from 'leaflet';
import { IUser } from '@/common/types';

export interface LatLng {
  lat: number;
  lon: number;
  original?: boolean;
}

export interface MapOptions {
  center: LatLng;
  zoom: number;
  zoomControl?: boolean;
  attributionControl?: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  location: LatLng;
  type: 'property' | 'location' | 'project' | 'professional';
}

export interface MarkerMeta {
  [key: string]: unknown;
}

export interface Marker {
  id: number;
  mappable_ype: string;
  mappable_id: number;
  mappable_data: IUser;
  location: LatLng;
  wardId?: number;
  streetId?: number;
  districtId?: number;
  cityId?: number;
  businessTypes?: string[];
  categoryTypes?: string[];
  meta?: MarkerMeta;
  marker_icon_url?: string;
  marker_label?: string;
}

export interface LeafletMapProps {
  center?: LatLng;
  zoom?: number;
  className?: string;
  onMapReady?: (map: unknown) => void;
  tileType?: string;
}

export interface MapControlsProps {
  onSearch?: (query: string) => void;
  onLocationClick?: () => void;
  onLayersClick?: () => void;
  onNavigationClick?: () => void;
  onHomeClick?: () => void;
  className?: string;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}


// Export the Leaflet Map type for use in other files
export type { LeafletMap };
