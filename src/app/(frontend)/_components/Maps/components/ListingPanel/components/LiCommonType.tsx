import React from 'react';
import Image from 'next/image';
import { MapPin, User } from 'lucide-react';
import { Marker } from '../../../types';

interface LiCommonTypeProps {
  marker: Marker;
  onClick: (marker: Marker) => void;
  onMouseEnter?: (marker: Marker) => void;
  onMouseLeave?: () => void;
}

const LiCommonType: React.FC<LiCommonTypeProps> = ({
  marker,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div
      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(marker)}
      onMouseEnter={() => onMouseEnter?.(marker)}
      onMouseLeave={() => onMouseLeave?.()}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {marker.marker_icon_url ? (
              <Image
                src={marker.marker_icon_url}
                alt={marker.marker_label || 'Marker'}
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

        {/* Content - Generic fallback */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {marker.marker_label || `${marker.mappable_type} #${marker.mappable_id}`}
          </h3>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {marker.location_name && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{marker.location_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiCommonType;
