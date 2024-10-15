'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';
import background_profile from '@assets/images/background_profile.jpg';
import Image, { StaticImageData } from 'next/image';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import ButtonPhone from '@components/button-phone';
import { CalendarDays } from 'lucide-react';
import { LuFacebook, LuMapPin, LuYoutube } from 'react-icons/lu';
import { cn, genKey } from '@common/utils';
import PostList from '@desktop/home/components/PostList';
import PostControls from '@desktop/home/components/PostControls';
import { searchApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import default_avatar from '@assets/images/default_avatar.png';
import NotFound from '@app/not-found';
import Link from 'next/link';
import { PiGenderIntersexBold } from 'react-icons/pi';
import { RiArticleLine } from 'react-icons/ri';
import { CustomerGender } from '@common/types';
import { throttle } from 'lodash-es';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {
  const [isVisible, setIsVisible] = React.useState(false);
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
  const profileImage = () => (
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
          src={imgSrc}
          onError={() => {
            setImgSrc(default_avatar);
          }}
          height={150}
          unoptimized
          width={150}
          className="profile-content_avatar rounded-full border-4 border-solid border-slate-200 bg-slate-300"
        />
      </div>
    </div>
  );
  const profileDescription = () => {
    return (
      profileData?.formatted_badges && (
        <div className="text-md mt-5 rounded-md border bg-white p-4">
          <ul className="list-inside list-disc">
            {profileData?.formatted_badges.map((item, index) => (
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
        {profileData?.profile_tags.map((item) => (
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
      {profileDescription()}
    </div>
  );

  const porfileListPost = () => (
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-primary_color">Tin đã đăng</h2>
      <div className="my-2">
        <PostControls isRedirectAfterApplyFilter={false} pagination={data?.pagination} />
      </div>
      <PostList
        className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-4"
        dataPostList={data?.data}
        isShowAuthor={false}
      />
    </div>
  );
  return (
    <>
      {!profileData ? (
        <NotFound className="h-full" errorCode={404} errorMessage="Not Found Data Of Profile" />
      ) : (
        <section className={styles.profile_detail_wrapper}>
          {profileImage()}
          <div className="flex flex-col gap-x-10 gap-y-10 sm:flex-row">
            {profileInformation()}
            {porfileListPost()}
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileDetailDesktop;
