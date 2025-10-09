import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, User, Calendar } from 'lucide-react';
import { Marker } from '../../../types';

interface ListingItemProps {
  marker: Marker;
  onClick: (marker: Marker) => void;
}

const ListingItem: React.FC<ListingItemProps> = ({ marker, onClick }) => {
  return (
    <div
      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(marker)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {marker.marker_icon_url ? (
              <Image
                src={marker.marker_icon_url}
                alt={marker.marker_label || 'Profile'}
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
          <h3 className="font-medium text-gray-900 truncate">
            {marker.marker_label || marker.profile?.full_name || 'Unknown'}
          </h3>

          {marker.profile?.job_title && (
            <p className="text-sm text-gray-600 truncate">
              {marker.profile.job_title}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {marker.location_name && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{marker.location_name}</span>
              </div>
            )}

            {marker.profile?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{marker.profile.phone}</span>
              </div>
            )}
          </div>

          {marker.profile?.profile_tags && marker.profile.profile_tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {marker.profile.profile_tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {marker.profile?.posts_count !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{marker.profile.posts_count} posts</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
