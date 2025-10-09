'use client';

import React from 'react';
import { SEARCH_BOX_WIDTH_WITH_PADDING } from '../../constants';
import { TMapSetting } from '../../types';
import { useLocationListing, useListingPanelState } from './hooks';
import { ListingPanelProps } from './types';
import {
  ListingItem,
  PanelHeader,
  Pagination,
  LoadingState,
  ErrorState,
  EmptyState,
} from './components';

const ListingPanel: React.FC<ListingPanelProps> = ({
  listingOption,
  onClose,
  onMarkerClick,
}) => {
  // Extract location UID from the option data
  const locationData = listingOption.data as TMapSetting;
  const locationUid = locationData?.uid;

  // Panel state management
  const {
    currentPage,
    perPage,
    handleMarkerClick,
    handlePreviousPage,
    handleNextPage,
  } = useListingPanelState(onClose, onMarkerClick);

  // Data fetching
  const { data, isLoading, error } = useLocationListing({
    locationUid,
    page: currentPage,
    perPage,
  });

  // Loading state
  if (isLoading) {
    return <LoadingState onClose={onClose} />;
  }

  // Error state
  if (error || !data?.success) {
    return <ErrorState onClose={onClose} />;
  }

  const { data: markers, pagination } = data;

  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={{ width: SEARCH_BOX_WIDTH_WITH_PADDING, height: '100vh', zIndex: 1000 }}
    >
      {/* Header */}
      <PanelHeader
        title={listingOption.text}
        totalCount={pagination.total_count}
        onClose={onClose}
      />

      {/* Listings */}
      <div className="flex-1 overflow-y-auto">
        {markers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4 p-4">
            {markers.map((marker) => (
              <ListingItem
                key={marker.uid}
                marker={marker}
                onClick={handleMarkerClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={pagination.total_pages}
        onPreviousPage={handlePreviousPage}
        onNextPage={() => handleNextPage(pagination.total_pages)}
      />
    </div>
  );
};

export default ListingPanel;
