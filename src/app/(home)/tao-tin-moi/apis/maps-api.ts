import axiosMapsInstance from '@api/axiosMapsInstance';
import { API_ROUTES } from '@common/router';

export interface LocationResponse {
  status: number | null;
  message: string | null;
  data: {
    status: boolean;
    address?: string;
    city?: { value: string; text: string };
    district?: { value: string; text: string };
    ward?: { value: string; text: string };
    polygon_points?: number[][];
  };
}

const MapsApiService = {
  abortController: new AbortController(), // Store a single instance initially

  GetLocationByLatLng: async (latLng: string) => {
    // Cancel the previous request, if any
    if (MapsApiService.abortController) {
      MapsApiService.abortController.abort(); // Abort previous request
    }

    // Create a new AbortController after the previous one was used
    MapsApiService.abortController = new AbortController(); // New instance
    const signal = MapsApiService.abortController.signal; // Use the new signal

    const params = new URLSearchParams();
    params.append('ll', latLng);

    const response = await axiosMapsInstance.get(API_ROUTES.MAPS.GET_LOCATION_BY_LAT_LNG, {
      params: params,
      signal: signal,
    });

    return response;
  },
};

export default MapsApiService;
