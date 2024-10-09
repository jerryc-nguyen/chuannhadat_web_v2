'use client';
import React from 'react';
import styles from './index.module.scss';
import background_profile from '@assets/images/background_profile.jpg';
import Image, { StaticImageData } from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import ButtonPhone from '@components/button-phone';
import { CalendarDays } from 'lucide-react';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';
import default_avatar from '@assets/images/default_avatar.png';
import NotFound from '@app/not-found';
import PostList from '@mobile/searchs/PostList';
import Link from 'next/link';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { RiArticleLine } from 'react-icons/ri';
import { CustomerGender } from '@common/types';

type ProfileDetailMobileProps = {
  profileSlug: string;
};

const ProfileDetailMobile: React.FC<ProfileDetailMobileProps> = ({ profileSlug }) => {
  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url as string,
  );

  const profileImage = () => (
    <div className="profile-image w-screen -translate-x-5">
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
          className="h-[24vh] w-full bg-white/20 object-cover contrast-50"
          src={background_profile}
          alt="Background customer"
        />
      </picture>
      <div className="relative -translate-y-[100px] pl-4">
        <Image
          draggable="false"
          alt="avatar-profile"
          src={imgSrc}
          onError={() => {
            setImgSrc(default_avatar);
          }}
          height={140}
          width={140}
          className="rounded-full border-4 border-solid border-slate-200 bg-slate-300"
        />
      </div>
    </div>
  );
  const listInfoProfileIcon = () => (
    <div className="mb-2 flex flex-col items-start gap-y-3">
      {profileData?.address && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <LuMapPin className="mr-2 h-5 w-5" />
          <span className="text-sm text-muted-foreground">{profileData?.address}</span>
        </span>
      )}
      {profileData?.formatted_joined_at && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <CalendarDays className="mr-2 h-5 w-5" />
          <span className="text-sm text-muted-foreground">{profileData?.formatted_joined_at}</span>
        </span>
      )}
      {profileData?.gender && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <PiGenderIntersexBold className="mr-2 h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            Giới tính {profileData?.gender === CustomerGender.Male ? 'nam' : 'nữ'}
          </span>
        </span>
      )}
      {profileData?.posts_count && (
        <span className="flex items-center gap-x-1 whitespace-nowrap">
          <RiArticleLine className="mr-2 h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            Số bài đăng {profileData?.posts_count}
          </span>
        </span>
      )}
      {profileData?.facebook_url && (
        <div className="flex items-center pt-2">
          <LuFacebook className="mr-2 h-4 w-4" />
          <Link
            href={profileData.facebook_url}
            className="text-xs text-muted-foreground hover:text-black"
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
            className="text-xs text-muted-foreground hover:text-black"
          >
            Liên kết youtube
          </Link>
        </div>
      )}
    </div>
  );
  const profileInformation = () => (
    <div className="flex flex-col gap-y-2">
      <h2 className="mt-4 text-2xl font-semibold">{profileData?.full_name}</h2>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {profileData?.profile_tags.map((item) => (
          <span
            className="text-nowrap rounded-[6px] bg-primary_color/80 px-[10px] py-1 text-xs font-semibold text-white shadow-md"
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
      <p className="text-muted-foregroun my-1 pr-4">
        {profileData?.job_title || profileData?.description}
      </p>
      {listInfoProfileIcon()}
      <ButtonPhone className="w-full py-2" phoneNumberProfile={profileData?.phone as string} />
    </div>
  );

  const porfileListPost = () => (
    <div>
      <h2 className="mb-2 mt-12 text-xl font-semibold text-primary_color">Tin đã đăng</h2>
      <PostList isRedirectAfterApplyFilter={false} />
    </div>
  );
  return (
    <section className={styles.profile_detail_wrapper}>
      {!profileData ? (
        <NotFound className="h-full" />
      ) : (
        <section>
          {profileImage()}
          <div className="-translate-y-[100px]">
            {profileInformation()}
            {porfileListPost()}
          </div>
        </section>
      )}
    </section>
  );
};

export default ProfileDetailMobile;
