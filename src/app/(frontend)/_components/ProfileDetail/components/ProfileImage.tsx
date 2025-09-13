import background_profile from '@assets/images/background_profile.jpg';
import Image, { StaticImageData } from 'next/image';
import default_avatar from '@assets/images/default_avatar.png';
import useResizeImage from '@common/hooks/useResizeImage';
import { useState } from 'react';

export default function ProfileImage({ profileData }: { profileData: A }) {
  const [imgSrc, setImgSrc] = useState<StaticImageData | string>(profileData?.avatar_url as string);
  const THUMB_WIDTH = 150;

  const { buildThumbnailUrl } = useResizeImage();

  return (
    <div className="profile-image mb-[75px] -translate-x-5 md:-translate-x-10">
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
          className="h-[30vh] w-full bg-white/20 object-cover contrast-50 md:h-[40vh]"
          src={background_profile}
          alt="Background customer"
        />
      </picture>
      <div className="absolute left-1/2 flex w-full -translate-x-1/2 -translate-y-2/4 justify-center gap-y-4 px-10 sm:justify-start md:-translate-y-1/2">
        <Image
          draggable="false"
          alt="avatar-profile"
          src={buildThumbnailUrl({ imageUrl: imgSrc.toString(), width: THUMB_WIDTH, ratio: 1 })}
          onError={() => {
            setImgSrc(default_avatar);
          }}
          height={THUMB_WIDTH}
          unoptimized
          width={THUMB_WIDTH}
          className="profile-content_avatar rounded-full border-4 border-solid border-slate-200 bg-slate-300"
        />
      </div>
    </div>
  );
}
