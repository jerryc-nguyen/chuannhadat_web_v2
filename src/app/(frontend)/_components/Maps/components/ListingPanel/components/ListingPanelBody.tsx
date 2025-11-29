'use client';

import React from 'react';
import { Marker } from '../../../types';
import { IPagination } from '@common/types/api';
import { ListingItem, Pagination, EmptyState } from './';

interface ListingPanelBodyProps {
  markers: Marker[];
  pagination: IPagination | null;
  currentPage: number;
  handleMarkerClick: (marker: Marker) => void;
  handleMouseEnter: (marker: Marker) => void;
  handleMouseLeave: () => void;
  handlePreviousPage: () => void;
  handleNextPage: (totalPages: number) => void;
}

const ListingPanelBody: React.FC<ListingPanelBodyProps> = ({
  markers,
  pagination,
  currentPage,
  handleMarkerClick,
  handleMouseEnter,
  handleMouseLeave,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <>
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
    </>
  );
};

export default ListingPanelBody;
