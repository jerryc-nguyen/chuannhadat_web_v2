import { useQuery } from '@tanstack/react-query';
import { getListingItems } from '../api';
import { ListingItemsParams, LocationListingResponse } from '../types';

/**
 * Custom hook for fetching location listing data
 * @param options - Configuration options for the hook
 * @returns Query result with data, loading state, and error
 */
export const useLocationListing = (params: ListingItemsParams) => {
  return useQuery<LocationListingResponse>({
    queryKey: ['location-listing', params],
    queryFn: () => getListingItems(params),
    enabled: !!params.location_uid || !!params.user_uid
  });
};
