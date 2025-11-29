import axiosInstance from '@common/api/axiosInstance';
import { LocationListingResponse, ListingItemsParams } from '../types';

export const listingItemsApi = {
  /**
   * Fetch location listing data
   * @param params - Request parameters
   * @returns Promise with location listing response
   */
  getListingItems: async (
    params: ListingItemsParams
  ): Promise<LocationListingResponse> => {


    const response = await axiosInstance.get('/api/v2/maps/listing_items', { params });
    return response.data;
  },
};

// Export individual functions for convenience
export const { getListingItems } = listingItemsApi;
