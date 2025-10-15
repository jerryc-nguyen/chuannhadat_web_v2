'use client';

import React from 'react';
import { ForLocationProps } from '../../types';
import ListingPanelCore from '../ListingPanelCore';
import { TMapSetting } from '@maps/types';
import { IUser } from '@common/types';

const ForLocationPanel: React.FC<ForLocationProps> = ({
  listingOption,
  onClose,
  onMarkerClick,
}) => {
  // Extract location UID from the option data
  const optionData = listingOption.data;
  const locationUid = listingOption.data_type === 'MapSetting' ? (optionData as TMapSetting).uid : undefined;
  const userUid = listingOption.data_type === 'User' ? (optionData as IUser).slug?.toString() : undefined;

  // Generate title
  const title = listingOption.text || 'Location Listings';

  // Prepare API parameters
  const apiParams = {
    location_uid: locationUid,
    user_uid: userUid,
  };

  const subtitleBuilder = (totalCount: number) => {
    return `${totalCount} môi giới`;
  };

  return (
    <ListingPanelCore
      title={title}
      subtitleBuilder={subtitleBuilder}
      apiParams={apiParams}
      onClose={onClose}
      onMarkerClick={onMarkerClick}
      isMobile={true}
    />
  );
};

export default ForLocationPanel;
