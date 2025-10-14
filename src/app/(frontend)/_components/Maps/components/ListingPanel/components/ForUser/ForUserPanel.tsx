'use client';

import React from 'react';
import { ForUserProps } from '../../types';
import ListingPanelCore from '../ListingPanelCore';

const ForUserPanel: React.FC<ForUserProps> = ({
  listingOption,
  onClose,
  onMarkerClick,
}) => {
  // Extract user ID from the option data
  const userData = listingOption.data;
  const userUid = userData?.slug?.toString();

  // Generate title
  const title = listingOption.text || `${userData.full_name}'s Listings`;

  // Prepare API parameters
  const apiParams = {
    user_uid: userUid,
  };

  return (
    <ListingPanelCore
      title={title}
      apiParams={apiParams}
      onClose={onClose}
      onMarkerClick={onMarkerClick}
    />
  );
};

export default ForUserPanel;
