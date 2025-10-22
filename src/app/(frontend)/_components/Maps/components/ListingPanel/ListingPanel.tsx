'use client';

import React from 'react';
import { ListingPanelProps, isLocationOption, isUserOption } from './types';
import { ForLocationPanel } from './components/ForLocation';
import { ForUserPanel } from './components/ForUser';

const ListingPanel: React.FC<ListingPanelProps> = ({
  listingOption,
  onClose,
  onMarkerClick,
}) => {
  console.log('listingOption', listingOption);
  // Route to appropriate component based on data type using type guards
  if (isLocationOption(listingOption) || !isUserOption(listingOption)) {
    console.log('isLocationOption', listingOption);
    return (
      <ForLocationPanel
        listingOption={listingOption}
        onClose={onClose}
        onMarkerClick={onMarkerClick}
      />
    );
  }

  if (isUserOption(listingOption)) {
    return (
      <ForUserPanel
        listingOption={listingOption}
        onClose={onClose}
        onMarkerClick={onMarkerClick}
      />
    );
  }

  // Fallback for unknown data types
  return (
    <div className="absolute top-0 left-0 bg-white rounded-lg shadow-lg flex flex-col p-4">
      <p>Error: Unknown listing type</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ListingPanel;
