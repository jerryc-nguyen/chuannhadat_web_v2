'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { CircleCheck as FaCircleCheck } from 'lucide-react';
import background_profile from '@assets/images/background_profile.jpg';
import default_avatar from '@assets/images/default_avatar.png';
import ButtonPhone from '@components/button-phone';
import useResizeImage from '@common/hooks/useResizeImage';

interface ProfileImageProps {
  imgSrc: StaticImageData | string;
  setImgSrc: (src: StaticImageData | string) => void;
  profileData?: {
    avatar_url?: string;
    facebook_url?: string;
    youtube_url?: string;
    phone?: string;
  }
}

const PROFILE_IMAGE_SIZE = 100;

const ProfileImage: React.FC<ProfileImageProps> = ({
  imgSrc,
  setImgSrc,
  profileData,
  showLinks = false,
}) => {
  const { cropSquare } = useResizeImage();

  return (
    <div className="profile-image w-screen">
      <picture>
        <source
          media="(min-width: 799px)"
          srcSet={
            'https://argonaut.au.reastatic.net/resi-property/prod/homepage-web/web_lrg-bdc6abbb97221105646a.avif'
          }
          type="image/avif"
        />
        <Image
          draggable="false"
          className="h-[20vh] w-full bg-white/20 object-cover contrast-50"
          src={background_profile}
          alt="Background customer"
        />
      </picture>
      <div className="relative flex -translate-y-[20px] items-center justify-between px-4">
        <div className="relative w-fit">
          <Image
            draggable="false"
            alt="avatar-profile"
            src={cropSquare((imgSrc || default_avatar).toString(), PROFILE_IMAGE_SIZE)}
            onError={() => {
              setImgSrc(default_avatar);
            }}
            height={PROFILE_IMAGE_SIZE}
            width={PROFILE_IMAGE_SIZE}
            className="rounded-full border-[5px] border-solid border-white bg-slate-300"
          />
          <span className="absolute bottom-1 right-1 block rounded-full border-2 border-white bg-white">
            <FaCircleCheck className="text-2xl text-success_color" />
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <ButtonPhone
            isCall={true}
            className="h-10 w-fit rounded-md px-3"
            phoneNumberProfile={profileData?.phone as string}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
