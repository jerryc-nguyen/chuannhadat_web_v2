'use client';
import React from 'react';
import styles from './index.module.scss';
import background_profile from '@assets/images/background_profile.jpg';
import Image, { StaticImageData } from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import ButtonPhone from '@components/button-phone';
import { LucideClock4 } from 'lucide-react';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';
import { genKey } from '@common/utils';
import default_avatar from '@assets/images/default_avatar.png';
import NotFound from '@app/not-found';
import PostList from '@mobile/searchs/PostList';
import Link from 'next/link';

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
        <h2 className="mt-4 text-2xl font-semibold">{profileData?.full_name}</h2>
        <p className="text-muted-foregroun my-1 pr-4">{profileData?.job_title}</p>
        <div className="flex gap-x-2">
          {profileData?.profile_tags.map((profile, index) => (
            <span
              key={genKey(index)}
              className="block rounded-sm border border-solid border-slate-200 bg-slate-100 px-2 py-1 text-xs"
            >
              {profile}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  const profileBadges = () => (
    <div className="flex flex-wrap items-center gap-y-4 pt-2">
      <ButtonPhone className="flex-1 py-3" phoneNumberProfile={profileData?.phone as string} />
    </div>
  );
  const profileDescription = () => (
    <>
      <p className="capitalize">{profileData?.description}</p>
      <div className="my-2">
        {profileData?.formatted_badges &&
          profileData?.formatted_badges.map((item, index) => <li key={genKey(index)}>{item}</li>)}
      </div>
      <div className="flex flex-col">
        {profileData?.formatted_joined_at && (
          <span className="flex items-center gap-x-2 whitespace-nowrap text-muted-foreground">
            <LucideClock4 className="h-4 w-4" />
            {profileData?.formatted_joined_at}
          </span>
        )}
        {profileData?.address && (
          <span className="flex items-center gap-x-2 whitespace-nowrap text-muted-foreground">
            <LuMapPin />
            {profileData?.address}
          </span>
        )}
      </div>
      {profileData?.facebook_url && (
        <div className="flex items-center pt-2">
          <LuFacebook className="mr-2 h-4 w-4 opacity-70" />
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
    </>
  );
  const porfileListPost = () => (
    <div>
      <h2 className="mb-2 mt-12 text-xl font-semibold">Tin đã đăng</h2>
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
            {profileBadges()}
            {profileDescription()}
            {porfileListPost()}
          </div>
        </section>
      )}
    </section>
  );
};

export default ProfileDetailMobile;
