import axiosInstance from '@common/api/axiosInstance';
import { AutocompleteSearchResponse } from '../types';

export const autocompleteApi = {
  search: async (params: Record<string, A> = {}): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.get('/api/v2/maps/autocompletes', { params });
  },
  recent: async (params: Record<string, A> = {}): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.get('/api/v2/maps/autocompletes/recent', { params });
  },
  deleteRecent: async (params: { target_type: string, target_id: number }): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.delete(`/api/v2/maps/autocompletes/delete_recent`, { params });
  },
};
