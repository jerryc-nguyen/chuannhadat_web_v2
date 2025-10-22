'use client';
import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { CheckCircle2, Phone, ArrowRight, Copy, Check } from 'lucide-react';
import default_avatar from '@assets/images/default_avatar.png';
import useResizeImage from '@common/hooks/useResizeImage';
import { IUser } from '@common/types';
import { Marker } from '@maps/types';
import { formatPhoneNumber } from '@common/stringHelpers';

interface InfoCardMobileProps {
  imgSrc: StaticImageData | string;
  setImgSrc: (src: StaticImageData | string) => void;
  profileData?: IUser,
  marker?: Marker;
  containerClassName?: string,
}

// Optimized profile image size for social card
const MOBILE_PROFILE_IMAGE_SIZE = 64;

const InfoCardMobile: React.FC<InfoCardMobileProps> = ({
  imgSrc,
  setImgSrc,
  profileData,
  marker
}) => {
  const { cropSquare } = useResizeImage();
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (profileData?.phone) {
      try {
        await navigator.clipboard.writeText(profileData.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy phone number:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <Image
              draggable="false"
              alt="Profile picture"
              src={cropSquare((imgSrc || default_avatar).toString(), MOBILE_PROFILE_IMAGE_SIZE)}
              onError={() => {
                setImgSrc(default_avatar);
              }}
              height={MOBILE_PROFILE_IMAGE_SIZE}
              width={MOBILE_PROFILE_IMAGE_SIZE}
              className="rounded-full border-3 border-white bg-gray-100 shadow-md ring-2 ring-gray-100"
            />
            {/* Verified badge */}
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full shadow-lg border-2 border-white">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate leading-tight" data-markerId={marker?.uid}>
                  {profileData?.full_name || 'Tên người dùng'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {profileData?.posts_count || 0} tin đăng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          {/* Message Button */}

          {/* Phone Section with Copy */}
          <button className="flex-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors touch-manipulation" onClick={handleCopyPhone}>
            <Phone className="w-5 h-5" />
            <span className="flex-1">{formatPhoneNumber(profileData?.phone || 'Số điện thoại')}</span>
            <span
              className="ml-2 p-1 hover:bg-blue-500 rounded transition-colors"
              title={copied ? 'Đã sao chép!' : 'Sao chép số điện thoại'}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-300" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </span>
          </button>

          {/* View Profile Button */}
          <a
            target="_blank"
            href={`/profile/${profileData?.slug}`}
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors touch-manipulation"
          >
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default InfoCardMobile;
