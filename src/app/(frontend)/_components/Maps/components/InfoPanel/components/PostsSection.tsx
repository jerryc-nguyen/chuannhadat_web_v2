import React from 'react';
import PostList from '@maps/components/Mappable/User/components/PostList';
import ActivePostFilters from '@maps/components/Mappable/User/components/ActivePostFilters';
import { IUser } from '@common/types';
import { Marker } from '../../../types';

interface PostsSectionProps {
  profileData: IUser;
  marker: Marker;
}

const PostsSection: React.FC<PostsSectionProps> = ({ profileData, marker }) => {
  return (
    <div className="px-4 py-2">
      <h2 className="text-g font-semibold text-gray-900 mb-4">
        Tin đã đăng {marker.location_name && `tại ${marker.location_name}`}
      </h2>

      <ActivePostFilters />

      <PostList
        profileData={profileData}
        wardId={marker.ward_id}
      />
    </div>
  );
};

export default PostsSection;
