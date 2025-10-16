'use client';

import React, { useState, useEffect } from 'react';
import { LISTING_PANEL_WIDTH_WITH_PADDING } from '../../../constants';
import { Marker } from '../../../types';
import { useMapBounds } from '../../../hooks/useMapBounds';
import { useLocationListing, useListingPanelState, useListingItemHover } from '../hooks';
import { ListingItemsParams } from '../types';
import { IPagination } from '@common/types/api';
import {
  PanelHeader,
  ListingPanelBody,
} from './';

interface ListingPanelCoreProps {
  title?: string;
  subtitleBuilder: (totalCount: number) => string;
  apiParams: ListingItemsParams;
  onClose: () => void;
  onMarkerClick?: (marker: Marker) => void;
  isMobile?: boolean;
}

const ListingPanelCore: React.FC<ListingPanelCoreProps> = ({
  title: title,
  subtitleBuilder,
  apiParams,
  onClose,
  onMarkerClick,
  isMobile = false,
}) => {
  // Get current map bounds and utilities
  const { getBoundsAndCenterForAPI } = useMapBounds();

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

  // Local state to hold display data - keeps old data visible while loading
  const [displayData, setDisplayData] = useState<{
    markers: Marker[];
    pagination: IPagination | null;
    locationTitle: string | null;
  } | null>(null);

  // Data fetching with dynamic parameters including map bounds and center
  const { data: response, isFetching, error } = useLocationListing({
    ...apiParams,
    ...(getBoundsAndCenterForAPI() || {}),
    page: currentPage,
    per_page: perPage,
  });

  // Update display data when new data arrives (but keep old data during loading)
  useEffect(() => {
    if (response && !isFetching) {
      const responseData = response as unknown as Record<string, unknown>;
      const markers = (responseData?.results as Marker[]) || [];
      const pagination = responseData?.pagination as IPagination | null;
      const locationTitle = responseData?.location_title as string | null;

      setDisplayData({
        markers,
        pagination,
        locationTitle,
      });
    }
  }, [response, isFetching]);

  // Use display data for rendering (keeps old data visible while loading)
  const markers = displayData?.markers || [];
  const pagination = displayData?.pagination || null;
  const locationTitle = displayData?.locationTitle || null;

  // Handle error state - show error overlay while keeping old data visible
  const hasError = error && !displayData; // Only show error if we have no data at all

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
        title={locationTitle || title || ''}
        subtitleBuilder={subtitleBuilder}
        totalCount={pagination?.total_count || 0}
        onClose={onClose}
      />

      {/* Body */}
      <div className="relative flex-1 overflow-y-auto">
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

        {/* Loading overlay - only show when fetching and we have data to show (background updates) */}
        {isFetching && displayData && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity duration-200">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-gray-600 font-medium">Cập nhật...</p>
            </div>
          </div>
        )}

        {/* Initial loading overlay - show when no data yet */}
        {isFetching && !displayData && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm text-gray-600 font-medium">Đang tải...</p>
            </div>
          </div>
        )}

        {/* Error overlay - only show if we have no data at all */}
        {hasError && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3 text-center max-w-xs">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Không thể tải dữ liệu</p>
                <p className="text-xs text-gray-500 mt-1">Vui lòng thử lại sau</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPanelCore;
