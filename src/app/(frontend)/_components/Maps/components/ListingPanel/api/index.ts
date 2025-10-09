import axiosInstance from '@common/api/axiosInstance';
import { LocationListingResponse, LocationListingParams } from '../types';

export const locationListingApi = {
  /**
   * Fetch location listing data
   * @param locationUid - The unique identifier for the location
   * @param params - Pagination parameters
   * @returns Promise with location listing response
   */
  getLocationListing: async (
    locationUid: string | undefined,
    params?: LocationListingParams
  ): Promise<LocationListingResponse> => {
    if (!locationUid) {
      throw new Error('Location UID is required');
    }

    const queryParams = {
      location_uid: locationUid,
      page: params?.page || 1,
      per_page: params?.per_page || 100,
    };

    const response = await axiosInstance.get('/api/v2/maps/location_listing', { params: queryParams });
    return response.data;
  },
};

// Export individual functions for convenience
export const { getLocationListing } = locationListingApi;
