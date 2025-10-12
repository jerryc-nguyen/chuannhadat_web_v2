import axiosInstance from '@common/api/axiosInstance';
import { AutocompleteSearchResponse } from '../types';

export const autocompleteApi = {
  search: async (params: { keyword: string }): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.get('/api/v2/maps/autocompletes', { params });
  },
  recent: async (params: { limit: number }): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.get('/api/v2/maps/autocompletes/recent', { params });
  },
  deleteRecent: async (id: number): Promise<AutocompleteSearchResponse> => {
    return axiosInstance.delete(`/api/v2/maps/autocompletes/recent/${id}`);
  },
};
