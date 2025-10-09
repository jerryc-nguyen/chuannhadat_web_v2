import { useState, useCallback } from 'react';
import { Marker } from '../../../types';

/**
 * Custom hook for managing listing panel state
 * @param onClose - Callback when panel is closed
 * @param onMarkerClick - Callback when a marker is clicked
 * @returns State and handlers for the listing panel
 */
export const useListingPanelState = (
  onClose?: () => void,
  onMarkerClick?: (marker: Marker) => void
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  const handleMarkerClick = useCallback((marker: Marker) => {
    onMarkerClick?.(marker);
    onClose?.(); // Close the panel after selecting a marker
  }, [onMarkerClick, onClose]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback((totalPages: number) => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    perPage,
    handleMarkerClick,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetPage,
  };
};
