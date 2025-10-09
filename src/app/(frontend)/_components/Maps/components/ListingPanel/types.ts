import { OptionForSelect } from '@common/types';
import { Marker } from '../../types';

export interface ListingPanelProps {
  listingOption: OptionForSelect;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
}

export interface LocationListingResponse {
  success: boolean;
  pagination: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
  data: Marker[];
}

export interface LocationListingParams {
  page?: number;
  per_page?: number;
}

export interface UseLocationListingOptions {
  locationUid: string;
  page: number;
  perPage: number;
}
