'use client';
import React from 'react';
import Image from 'next/image';
import { MapPin, Heart, Camera } from 'lucide-react';
import { IProductList } from '@common/types';

interface PostItemProps {
  post: IProductList;
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
      className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex">
        {/* Left Section - Thumbnail */}
        <div className="relative w-32 h-33 flex-shrink-0">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}

          {/* Photo Count */}
          {post.images_count && post.images_count > 0 && (
            <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded flex items-center gap-1 text-white">
              <Camera className="w-3 h-3" />
              {post.images_count}
            </div>
          )}
        </div>

        {/* Right Section - Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div className="relative">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {post.title}
            </h3>

            {/* Property Type */}
            <div className="flex items-center gap-2 mb-2">
              {post.bedrooms_count && (
                <span className="text-xs text-gray-600">{post.bedrooms_count} PN</span>
              )}
              {post.bus_cat_type && (
                <span className="text-xs text-gray-600">{post.bus_cat_type}</span>
              )}
            </div>

            {/* Price and Area */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-red-600">
                {post.formatted_price}
              </span>
              {post.formatted_price_per_m2 && (
                <span className="text-sm text-gray-900">
                  {post.formatted_price_per_m2}
                </span>
              )}
              {post.formatted_area && (
                <span className="text-sm text-gray-900">
                  {post.formatted_area}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600 truncate">
                {post.short_location_name}
              </span>
            </div>

            {/* Favorite Button - Absolute positioned */}
            <button
              className="absolute bottom-1 right-2 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
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
