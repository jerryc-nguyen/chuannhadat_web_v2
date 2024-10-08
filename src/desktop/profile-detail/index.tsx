'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';
import background_profile from '@assets/images/background_profile.jpg';
import Image, { StaticImageData } from 'next/image';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import ButtonPhone from '@components/button-phone';
import { LucideClock4 } from 'lucide-react';
import { LuMapPin } from 'react-icons/lu';
import { genKey } from '@common/utils';
import PostList from '@desktop/home/components/PostList';
import PostControls from '@desktop/home/components/PostControls';
import { searchApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import default_avatar from '@assets/images/default_avatar.png';
import NotFound from '@app/not-found';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {
  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url as string,
  );
  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: false });
  const { data } = useSuspenseQuery({
    queryKey: ['profile-post', { filterParams, profileSlug }],
    queryFn: () =>
      searchApi({
        ...filterParams,
        author_slug: profileSlug,
      }),
  });

  const profileImage = () => (
    <div className="profile-image mb-[160px] -translate-x-5 md:mb-[75px] md:-translate-x-10">
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
      <div className="absolute left-1/2 flex w-full -translate-x-1/2 -translate-y-1/3 flex-col items-center justify-center gap-x-5 gap-y-4 px-10 md:-translate-y-1/2 md:flex-row md:items-end md:justify-between">
        <Image
          draggable="false"
          alt="avatar-profile"
          src={imgSrc}
          onError={() => {
            setImgSrc(default_avatar);
          }}
          height={150}
          width={150}
          className="profile-content_avatar rounded-full border-4 border-solid border-slate-200 bg-slate-300"
        />
        <div className="profile-content_info flex flex-1 flex-col items-center justify-between gap-y-2 md:h-[75px] md:flex-row">
          <h2 className="text-2xl font-semibold">{profileData?.full_name}</h2>
          <div className="flex flex-col items-center md:items-end">
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
        </div>
      </div>
    </div>
  );
  const profileBadges = () => (
    <div className="profile-tags flex flex-wrap items-center justify-center gap-x-3 gap-y-3 pt-5 md:justify-start">
      {profileData?.profile_tags.map((profile, index) => (
        <span
          key={genKey(index)}
          className="w-fit whitespace-nowrap rounded-sm border bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600"
        >
          {profile}
        </span>
      ))}
      <ButtonPhone phoneNumberProfile={profileData?.phone as string} />
    </div>
  );
  const profileDescription = () => (
    <>
      <p className="mt-3">{profileData?.description}</p>
      <div className="mb-4 w-1/2">
        {profileData?.formatted_badges &&
          profileData?.formatted_badges.map((item, index) => <li key={genKey(index)}>{item}</li>)}
      </div>
    </>
  );
  const porfileListPost = () => (
    <div className="">
      <h2 className="mt-12 text-2xl font-bold text-primary_color">Tin đã đăng</h2>
      <div className="my-2">
        <PostControls
          isRedirectAfterApplyFilter={false}
          isShowListChips={false}
          pagination={data?.pagination}
        />
      </div>
      <PostList dataPostList={data?.data} isShowAuthor={false} />
    </div>
  );
  return (
    <>
      {!profileData ? (
        <NotFound className="h-full" errorCode={404} errorMessage="Not Found Data Of Profile" />
      ) : (
        <section className={styles.profile_detail_wrapper}>
          {profileImage()}
          {profileBadges()}
          {profileDescription()}
          {porfileListPost()}
        </section>
      )}
    </>
  );
};

export default ProfileDetailDesktop;
