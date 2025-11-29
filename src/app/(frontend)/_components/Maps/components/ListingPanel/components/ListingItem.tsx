import React from 'react';
import { Marker } from '../../../types';
import LiUser from './LiUser';
import LiCommonType from './LiCommonType';

interface ListingItemProps {
  marker: Marker;
  onClick: (marker: Marker) => void;
  onMouseEnter?: (marker: Marker) => void;
  onMouseLeave?: () => void;
}

const ListingItem: React.FC<ListingItemProps> = ({
  marker,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // Route to appropriate specialized component based on marker type
  // For now, we only have IUser support, but this structure allows easy extension

  // Check if marker is of type User (indicates IUser data)
  if (marker.mappable_type === 'User') {
    return (
      <LiUser
        marker={marker}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }

  // Fallback for other marker types
  return (
    <LiCommonType
      marker={marker}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default ListingItem;
