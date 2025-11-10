import { useProfileData } from '@maps/components/Mappable/User/hooks';
import { useRelatedLocation } from '../../hooks/useRelatedLocation';
import { UseInfoPanelOptions } from '../types';

/**
 * Custom hook for managing InfoPanel data and interactions
 * @param options - Configuration options for the hook
 * @returns Profile data, handlers, and loading states
 */
export const useInfoPanelData = ({ marker }: UseInfoPanelOptions) => {
  // Profile data hook
  const profileDataResult = useProfileData({
    user: marker.mappable_data
  });

  // Related location click handler
  const handleRelatedLocationClick = useRelatedLocation();

  return {
    ...profileDataResult,
    handleRelatedLocationClick,
    marker,
  };
};
