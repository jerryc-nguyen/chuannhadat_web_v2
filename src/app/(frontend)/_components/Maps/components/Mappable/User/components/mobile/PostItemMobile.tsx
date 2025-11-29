'use client';
import React from 'react';
import Image from 'next/image';
import { Camera, Clock } from 'lucide-react';
import { IProductList } from '@common/types';
import ButtonSave from '@frontend/features/product-detail-actions/save-post/ButtonSave';
import useResizeImage from '@common/hooks/useResizeImage';

interface PostItemProps {
  post: IProductList;
  onClick?: (post: PostItemProps['post']) => void;
}

const PostItemMobile: React.FC<PostItemProps> = ({ post, onClick }) => {

  const { buildThumbnailUrl } = useResizeImage();
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer touch-manipulation active:scale-[0.98]"
      onClick={handleClick}
    >
      <div className="p-4 space-y-3">
        {/* Title at the top */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
          {post.title}
        </h3>

        {/* Main Content Section */}
        <div className="flex gap-3">
          {/* Left Section - Thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
            {post.featured_image_url ? (
              <Image
                src={buildThumbnailUrl({ imageUrl: post.featured_image_url, width: 160 })}
                alt={post.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Camera className="w-5 h-5 text-gray-400" />
              </div>
            )}

            {/* Photo Count Badge */}
            {post.images_count && post.images_count > 0 && (
              <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white text-xs px-1 py-0.5 rounded flex items-center gap-0.5">
                <Camera className="w-2 h-2" />
                <span className="font-medium text-xs">{post.images_count}</span>
              </div>
            )}
          </div>

          {/* Right Section - Content (Resized) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Content Section */}
            <div className="space-y-2">
              {/* Property Details */}
              <div className="flex gap-2 text-gray-600">
                {post.bedrooms_count && (
                  <span className="pr-2 rounded-md text-xs font-medium">
                    {post.bedrooms_count} PN
                  </span>
                )}
                {post.bus_cat_type && (
                  <span className="pr-2 rounded-md text-xs font-medium">
                    {post.bus_cat_type}
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="space-y-1">
                <div className="text-lg font-bold text-red-600">
                  {post.formatted_price}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {post.business_type === 'sell' && post.formatted_price_per_m2 && (
                    <span>{post.formatted_price_per_m2}</span>
                  )}
                  {post.formatted_area && (
                    <span className="flex items-center gap-1">
                      <span>•</span>
                      {post.formatted_area}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-2">
          {/* Time */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{post.formatted_publish_at}</span>
          </div>

          {/* Save Button */}
          <div className="flex-shrink-0">
            <ButtonSave
              postUid={post.uid}
              className="!relative !top-auto !right-auto !bottom-auto !left-auto !opacity-100 !visible !p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PostItemMobile;
