import React from 'react';
import RelatedLocations from '@maps/components/Mappable/User/components/RelatedLocations';
import { IUser } from '@common/types';
import { Marker } from '../../../types';

interface RelatedLocationsSectionProps {
  profileData: IUser;
  marker: Marker;
  onItemClicked: (marker: Marker) => void;
}

const RelatedLocationsSection: React.FC<RelatedLocationsSectionProps> = ({
  profileData,
  marker,
  onItemClicked,
}) => {
  return (
    <div className="px-4 py-2">
      <RelatedLocations
        profileData={profileData}
        markerUid={marker.uid}
        onItemClicked={onItemClicked}
      />
    </div>
  );
};

export default RelatedLocationsSection;
