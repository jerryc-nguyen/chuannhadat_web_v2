import { useQuery } from '@tanstack/react-query';
import { getLocationListing } from '../api';
import { UseLocationListingOptions, LocationListingResponse } from '../types';

/**
 * Custom hook for fetching location listing data
 * @param options - Configuration options for the hook
 * @returns Query result with data, loading state, and error
 */
export const useLocationListing = ({ locationUid, page, perPage }: UseLocationListingOptions) => {
  return useQuery<LocationListingResponse>({
    queryKey: ['location-listing', locationUid, page, perPage],
    queryFn: () => getLocationListing(locationUid, { page, per_page: perPage }),
    enabled: !!locationUid
  });
};
