import React from 'react';
import Image from 'next/image';
import { MapPin, User, Calendar } from 'lucide-react';
import { Marker } from '../../../types';

interface LiUserProps {
  marker: Marker;
  onClick: (marker: Marker) => void;
  onMouseEnter?: (marker: Marker) => void;
  onMouseLeave?: () => void;
}

const LiUser: React.FC<LiUserProps> = ({
  marker,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // Type guard to check if marker is of type User (IUser data)
  const isUserMarker = (marker: Marker): marker is Marker & {
    mappable_data: {
      id: number;
      slug: string;
      full_name: string;
      avatar_url: string;
      posts_count: number;
      local_count: number;
      local_location_name: string;
    }
  } => {
    return marker.mappable_type === 'User' && !!marker.mappable_data;
  };

  if (!isUserMarker(marker)) {
    return null; // or return a basic fallback component
  }

  return (
    <div
      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(marker)}
      onMouseEnter={() => onMouseEnter?.(marker)}
      onMouseLeave={() => onMouseLeave?.()}
    >
      {/* Header - Location name with pin icon */}
      {marker.mappable_data.local_location_name && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
          <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-base">
            {marker.mappable_data.local_location_name}
          </h3>
        </div>
      )}

      {/* Body - User info and metrics */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {marker.mappable_data.avatar_url ? (
              <Image
                src={marker.mappable_data.avatar_url}
                alt={marker.marker_label || marker.mappable_data.full_name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 mb-2">
            {marker.marker_label || marker.mappable_data.full_name}
          </h4>

          {/* Posts and locations count */}
          {(marker.mappable_data.posts_count !== undefined || (marker.mappable_data.local_count !== undefined && marker.mappable_data.local_count > 0)) && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {marker.mappable_data.posts_count !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">{marker.mappable_data.local_count}</span>
                  <span className="text-gray-500">tin đăng</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiUser;
