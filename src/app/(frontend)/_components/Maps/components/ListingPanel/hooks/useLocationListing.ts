import { useQuery } from '@tanstack/react-query';
import { getLocationListing } from '../api';
import { UseLocationListingOptions } from '../types';

/**
 * Custom hook for fetching location listing data
 * @param options - Configuration options for the hook
 * @returns Query result with data, loading state, and error
 */
export const useLocationListing = ({ locationUid, page, perPage }: UseLocationListingOptions) => {
  return useQuery({
    queryKey: ['location-listing', locationUid, page, perPage],
    queryFn: () => getLocationListing(locationUid, { page, per_page: perPage }),
    enabled: !!locationUid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
