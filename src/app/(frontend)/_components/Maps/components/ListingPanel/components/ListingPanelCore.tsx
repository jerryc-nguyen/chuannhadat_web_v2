'use client';

import React from 'react';
import { LISTING_PANEL_WIDTH_WITH_PADDING } from '../../../constants';
import { Marker } from '../../../types';
import { useLocationListing, useListingPanelState, useListingItemHover } from '../hooks';
import { ListingItemsParams } from '../types';
import { IPagination } from '@common/types/api';
import {
  PanelHeader,
  LoadingState,
  ErrorState,
  ListingPanelBody,
} from './';

interface ListingPanelCoreProps {
  title: string;
  subtitleBuilder: (totalCount: number) => string;
  apiParams: ListingItemsParams;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
  isMobile?: boolean;
}

const ListingPanelCore: React.FC<ListingPanelCoreProps> = ({
  title,
  subtitleBuilder,
  apiParams,
  onClose,
  onMarkerClick,
  isMobile = false,
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

  // Mobile: return only the body
  if (isMobile) {
    return (
      <ListingPanelBody
        markers={markers}
        pagination={pagination}
        currentPage={currentPage}
        handleMarkerClick={handleMarkerClick}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    );
  }

  return (
    <div
      className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col"
      style={{
        width: LISTING_PANEL_WIDTH_WITH_PADDING,
        height: '100vh',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <PanelHeader
        title={title}
        subtitleBuilder={subtitleBuilder}
        totalCount={pagination?.total_count || 0}
        onClose={onClose}
      />

      {/* Body */}
      <ListingPanelBody
        markers={markers}
        pagination={pagination}
        currentPage={currentPage}
        handleMarkerClick={handleMarkerClick}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default ListingPanelCore;
