import { useCallback } from 'react';
import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';

/**
 * Payload interface for tracking actions
 */
export interface ITrackActionPayload {
  target_type: string;
  target_id: string;
  action: string;
}

/**
 * Simple hook for tracking user actions
 */
export const useTrackAction = () => {
  /**
   * Track an action by sending payload to server
   * @param payload - The tracking payload
   */
  const trackAction = useCallback(async (payload: ITrackActionPayload) => {
    try {
      await axiosInstance.post(API_ROUTES.TRACKINGS.TRACK_ACTION, payload);
    } catch (error) {
      // Silently fail - tracking should not affect user experience
      console.warn('Failed to track action:', error);
    }
  }, []);

  return {
    trackAction,
  };
};

export default useTrackAction;
