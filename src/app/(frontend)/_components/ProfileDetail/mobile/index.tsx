'use client';
import { profilesApi } from '../api/profiles';
import NotFound from '@app/not-found';
import background_profile from '@assets/images/background_profile.jpg';
import default_avatar from '@assets/images/default_avatar.png';
import ButtonPhone from '@components/button-phone';
import { filterChipOptionsByAggregations } from '@common/filterHelpers';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import useResizeImage from '@common/hooks/useResizeImage';
import { listFilterProfileMobile } from '@frontend/CategoryPage/constants';
import FilterChips from '@frontend/features/search/filter-conditions/mobile/FilterChips';
import PostList from '@frontend/CategoryPage/mobile/searchs/PostList';
import { useQuery } from '@tanstack/react-query';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { MoreHorizontal as BsThreeDots, CircleCheck as FaCircleCheck } from 'lucide-react';
import styles from './index.module.scss';

type ProfileDetailMobileProps = {
  profileSlug: string;
};

const PROFILE_IMAGE_SIZE = 100;

const ProfileDetailMobile: React.FC<ProfileDetailMobileProps> = ({ profileSlug }) => {
  useSyncParamsToState();
  const { cropSquare } = useResizeImage();
  const { searchAggs } = useSearchAggs();
  const { resetLocations } = useMainContentNavigator();

  // Reset locations when the component mounts
  useEffect(() => {
    resetLocations();
  }, [resetLocations]);

  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => profilesApi.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url as string,
  );

  // Filter out AggProjects when aggregations don't contain projects
  const filteredChipOptions = useMemo(() => {
    return filterChipOptionsByAggregations(listFilterProfileMobile, searchAggs);
  }, [searchAggs]);

  const profileImage = () => (
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
            src={cropSquare(imgSrc.toString(), PROFILE_IMAGE_SIZE)}
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
          {(profileData?.facebook_url || profileData?.youtube_url) && (
            <DropdownMenu>
              <DropdownMenuTrigger className="block h-full rounded-md bg-slate-100 p-3">
                <BsThreeDots />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Liên kết</DropdownMenuLabel>
                {profileData?.facebook_url && (
                  <DropdownMenuItem>
                    <Link
                      target="_blank"
                      href={profileData.facebook_url}
                      className="text-xs text-secondary hover:text-black"
                    >
                      Link facebook
                    </Link>
                  </DropdownMenuItem>
                )}
                {profileData?.youtube_url && (
                  <DropdownMenuItem>
                    <Link
                      target="_blank"
                      href={profileData.youtube_url}
                      className="text-xs text-secondary hover:text-black"
                    >
                      Link youtube
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ButtonPhone
            isCall={true}
            className="h-10 w-fit rounded-md px-3"
            phoneNumberProfile={profileData?.phone as string}
          />
        </div>
      </div>
    </div>
  );

  const profileInformation = () => (
    <div className="flex flex-col gap-y-2 pl-4">
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
      {(profileData?.job_title || profileData?.description) && (
        <p className="text-muted-foreground">
          {profileData?.job_title || profileData?.description}
        </p>
      )}
      {profileData?.address && <p className="text-muted-foreground">{profileData?.address}</p>}

      <div className="mb-2 flex items-center gap-x-4">
        {(profileData?.posts_count || 0) > 0 && (
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-secondary">Số bài đăng</span>
            <b>{profileData?.posts_count}</b>
          </div>
        )}
      </div>
    </div>
  );

  const profileListPost = () => (
    <>
      <h2 className="mb-2 ml-4 mt-4 text-xl font-semibold text-primary_color">Tin đã đăng</h2>
      <div className="my-4">
        <FilterChips chipOptions={filteredChipOptions} />
      </div>
      <PostList />
    </>
  );

  return (
    <section className={styles.profile_detail_wrapper}>
      {!profileData ? (
        <NotFound errorMessage="No profile data for this profile id" className="h-full py-10" />
      ) : (
        <section>
          {profileImage()}
          <div className="-translate-y-[20px]">
            {profileInformation()}
            {profileListPost()}
          </div>
        </section>
      )}
    </section>
  );
};

export default ProfileDetailMobile;
