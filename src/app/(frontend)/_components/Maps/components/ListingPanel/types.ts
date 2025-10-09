import { OptionForSelect } from '@common/types';
import { IPagination } from '@common/types/api';
import { Marker } from '../../types';

export interface ListingPanelProps {
  listingOption: OptionForSelect;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
}

// API returns direct object with pagination and results (not wrapped in IResponseListData)
export interface LocationListingResponse {
  pagination: IPagination;
  results: Marker[];
}

export interface LocationListingParams {
  page?: number;
  per_page?: number;
}

export interface UseLocationListingOptions {
  locationUid: string | undefined;
  page: number;
  perPage: number;
}
