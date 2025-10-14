'use client';

import React from 'react';
import { LISTING_PANEL_WIDTH_WITH_PADDING } from '../../../constants';
import { Marker } from '../../../types';
import { useLocationListing, useListingPanelState, useListingItemHover } from '../hooks';
import { ListingItemsParams } from '../types';
import { IPagination } from '@common/types/api';
import {
  ListingItem,
  PanelHeader,
  Pagination,
  LoadingState,
  ErrorState,
  EmptyState,
} from './';

interface ListingPanelCoreProps {
  title: string;
  subtitleBuilder: (totalCount: number) => string;
  apiParams: ListingItemsParams;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
}

const ListingPanelCore: React.FC<ListingPanelCoreProps> = ({
  title,
  subtitleBuilder,
  apiParams,
  onClose,
  onMarkerClick,
}) => {
  // Panel state management
  const {
    currentPage,
    perPage,
    handleMarkerClick,
    handlePreviousPage,
    handleNextPage,
  } = useListingPanelState(onClose, onMarkerClick);

  // Hover interaction handlers
  const { handleMouseEnter, handleMouseLeave } = useListingItemHover();

  // Data fetching with dynamic parameters
  const { data: response, isLoading, error } = useLocationListing({
    ...apiParams,
    page: currentPage,
    per_page: perPage,
  });

  // Loading state
  if (isLoading) {
    return <LoadingState onClose={onClose} />;
  }

  // Error state
  if (error || !response) {
    console.error('ListingPanelCore error:', error);
    return <ErrorState onClose={onClose} />;
  }

  // Handle the actual API response structure: { pagination: {...}, results: [...] } (direct format)
  const responseData = response as unknown as Record<string, unknown>;
  const markers = (responseData?.results as Marker[]) || [];
  const pagination = responseData?.pagination as IPagination | null;

  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={{ width: LISTING_PANEL_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}
    >
      {/* Header */}
      <PanelHeader
        title={title}
        subtitleBuilder={subtitleBuilder}
        totalCount={pagination?.total_count || 0}
        onClose={onClose}
      />

      {/* Listings */}
      <div className="flex-1 overflow-y-auto">
        {!markers || markers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4 p-4">
            {markers.map((marker: Marker) => (
              <ListingItem
                key={marker.uid}
                marker={marker}
                onClick={handleMarkerClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.total_pages || 1}
          onPreviousPage={handlePreviousPage}
          onNextPage={() => handleNextPage(pagination.total_pages || 1)}
        />
      )}
    </div>
  );
};

export default ListingPanelCore;
