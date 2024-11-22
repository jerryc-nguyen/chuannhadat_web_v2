import Image, { StaticImageData } from 'next/image';
import default_avatar from '@assets/images/default_avatar.png';
import { throttle } from 'lodash-es';
import { cn, genKey } from '@common/utils';
import ButtonPhone from '@components/button-phone';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';
import { CalendarDays, Link } from 'lucide-react';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { CustomerGender } from '@common/types';
import { RiArticleLine } from 'react-icons/ri';
import React from 'react';

export default function ProfileInfo({ profileData }: { profileData: A }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 420) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  React.useEffect(() => {
    const handleScroll = throttle(toggleVisibility, 200);

    // Lắng nghe sự kiện scroll với hàm đã được throttle
    window.addEventListener('scroll', handleScroll);

    // Gỡ bỏ sự kiện khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url as string,
  );

  const profileBadges = () => {
    return (
      profileData?.formatted_badges && (
        <div className="text-md mt-5 rounded-md border bg-white p-4">
          <ul className="list-inside list-disc">
            {profileData?.formatted_badges.map((item: A, index: number) => (
              <li key={genKey(index)}>{item}</li>
            ))}
          </ul>
        </div>
      )
    );
  };


  const listInfoProfileIcon = () => (
    <div className="flex flex-col items-center gap-y-3 sm:items-start">
      {profileData?.address && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <LuMapPin className="mr-2 h-5 w-5" />
          <span className="text-sm text-secondary">{profileData?.address}</span>
        </span>
      )}
      {profileData?.formatted_joined_at && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <CalendarDays className="mr-2 h-5 w-5" />
          <span className="text-sm text-secondary">{profileData?.formatted_joined_at}</span>
        </span>
      )}
      {profileData?.gender && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <PiGenderIntersexBold className="mr-2 h-5 w-5" />
          <span className="text-sm text-secondary">
            Giới tính {profileData?.gender === CustomerGender.Male ? 'nam' : 'nữ'}
          </span>
        </span>
      )}
      {profileData?.posts_count && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <RiArticleLine className="mr-2 h-5 w-5" />
          <span className="text-sm text-secondary">
            Số bài đăng {profileData?.posts_count}
          </span>
        </span>
      )}
      {profileData?.facebook_url && (
        <div className="flex items-center pt-2">
          <LuFacebook className="mr-2 h-4 w-4" />
          <Link
            href={profileData.facebook_url}
            className="text-xs text-secondary hover:text-black"
          >
            Liên kết facebook
          </Link>
        </div>
      )}
      {profileData?.youtube_url && (
        <div className="flex items-center pt-2">
          <LuYoutube className="mr-2 h-4 w-4 opacity-70" />
          <Link
            href={profileData.youtube_url}
            className="text-xs text-secondary hover:text-black"
          >
            Liên kết youtube
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-content_info z-4 top-[10vh] flex h-fit w-full min-w-[250px] flex-col items-center gap-y-2 sm:sticky sm:w-[18vw] sm:items-start">
      <Image
        draggable="false"
        alt="avatar-profile"
        src={imgSrc}
        onError={() => {
          setImgSrc(default_avatar);
        }}
        height={isVisible ? 150 : 0}
        unoptimized
        width={isVisible ? 150 : 0}
        className={cn(
          'profile-content_avatar !hidden rounded-full border-4 border-solid border-slate-200 bg-slate-300 sm:block',
          isVisible ? 'show_avatar' : 'hidden_avatar',
        )}
      />
      <h2 className="mt-2 text-xl font-semibold">{profileData?.full_name}</h2>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {profileData?.profile_tags.map((item: A) => (
          <span
            className="text-nowrap rounded-[6px] bg-primary_color/80 px-[10px] py-1 text-xs font-semibold text-white shadow-md"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-sm">{profileData?.job_title || profileData?.description}</p>
      {listInfoProfileIcon()}
      <ButtonPhone className="w-full" phoneNumberProfile={profileData?.phone as string} />
      {profileBadges()}
    </div>
  )
}
