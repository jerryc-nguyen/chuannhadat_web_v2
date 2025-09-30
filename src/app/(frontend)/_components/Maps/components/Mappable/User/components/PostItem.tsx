'use client';
import React from 'react';
import Image from 'next/image';
import { MapPin, Heart, Camera, Check } from 'lucide-react';

interface PostItemProps {
  post: {
    id: number;
    title: string;
    price: string;
    price_per_m2?: string;
    area?: string;
    address: string;
    created_at: string;
    slug: string;
    thumbnail_url?: string;
    photo_count?: number;
    is_priority?: boolean;
    property_type?: string;
    bedroom_count?: string;
    is_partner?: boolean;
  };
  onClick?: (post: PostItemProps['post']) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex">
        {/* Left Section - Thumbnail */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* Priority Badge */}
          {post.is_priority && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Tin ưu tiên
            </div>
          )}

          {/* Photo Count */}
          {post.photo_count && post.photo_count > 0 && (
            <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
              <Camera className="w-3 h-3" />
              {post.photo_count}
            </div>
          )}
        </div>

        {/* Right Section - Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            {/* Partner Badge */}
            {post.is_partner && (
              <div className="flex items-center gap-1 mb-2">
                <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Đối Tác
                </div>
              </div>
            )}

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {post.title}
            </h3>

            {/* Property Type */}
            <div className="flex items-center gap-2 mb-2">
              {post.bedroom_count && (
                <span className="text-xs text-gray-600">{post.bedroom_count}</span>
              )}
              {post.property_type && (
                <span className="text-xs text-gray-600">{post.property_type}</span>
              )}
            </div>

            {/* Price and Area */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-red-600">
                {post.price}
              </span>
              {post.price_per_m2 && (
                <span className="text-sm text-gray-900">
                  {post.price_per_m2}
                </span>
              )}
              {post.area && (
                <span className="text-sm text-gray-900">
                  {post.area}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600 truncate">
                {post.address}
              </span>
            </div>
          </div>

          {/* Bottom Section - Favorite Button */}
          <div className="flex justify-end">
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite action
              }}
            >
              <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
