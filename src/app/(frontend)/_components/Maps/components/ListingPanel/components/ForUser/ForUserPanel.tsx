'use client';

import React from 'react';
import { ForUserProps } from '../../types';
import ListingPanelCore from '../ListingPanelCore';
import { useApp } from '@common/context/AppContext';

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

  const subtitleBuilder = (totalCount: number) => {
    return `${totalCount} khu vực hoạt động`;
  };

  const { isMobile } = useApp();
  return (
    <ListingPanelCore
      title={title}
      subtitleBuilder={subtitleBuilder}
      apiParams={apiParams}
      onClose={onClose}
      onMarkerClick={onMarkerClick}
      isMobile={isMobile}
    />
  );
};

export default ForUserPanel;
