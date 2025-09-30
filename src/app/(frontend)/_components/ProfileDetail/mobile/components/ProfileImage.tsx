'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import default_avatar from '@assets/images/default_avatar.png';
import useResizeImage from '@common/hooks/useResizeImage';
import SocialLinks from '@frontend/ProfileDetail/mobile/components/SocialLinks';
import { IUser } from '@common/types';

interface ProfileImageProps {
  imgSrc: StaticImageData | string;
  setImgSrc: (src: StaticImageData | string) => void;
  profileData?: IUser,
  containerClassName?: string,
}

const PROFILE_IMAGE_SIZE = 120;

const ProfileImage: React.FC<ProfileImageProps> = ({
  imgSrc,
  setImgSrc,
  profileData,
  containerClassName = 'pt-6 pb-4 px-4 mb-6'
}) => {
  const { cropSquare } = useResizeImage();

  return (
    <div className={`flex items-start gap-5 bg-white ${containerClassName}`}>
      {/* Left Column - Avatar */}
      <div className="relative flex-shrink-0">
        <div className="relative w-fit">
          <Image
            draggable="false"
            alt="Profile picture"
            src={cropSquare((imgSrc || default_avatar).toString(), PROFILE_IMAGE_SIZE)}
            onError={() => {
              setImgSrc(default_avatar);
            }}
            height={PROFILE_IMAGE_SIZE}
            width={PROFILE_IMAGE_SIZE}
            className="rounded-full border-3 border-gray-200 bg-gray-100 shadow-md"
          />
          {/* Verified badge */}
          <div className="absolute bottom-1 right-1 bg-white rounded-full shadow-lg border border-gray-100">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Right Column - Profile Info */}
      <div className="flex-1 min-w-0 pt-2">
        {/* Name and Social Links */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 truncate pr-2">
            {profileData?.full_name || 'Tên người dùng'}
          </h1>
          <SocialLinks profileData={profileData} />
        </div>

        {profileData?.profile_tags && profileData.profile_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 my-3">
            {profileData.profile_tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs inline-block px-2 py-1 rounded-full border border-gray-200 text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Count */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-900 mr-1">
            {profileData?.posts_count || 0}
          </span>
          <span className="text-gray-600">tin đăng</span>
        </div>

      </div>
    </div>
  );
};

export default ProfileImage;
