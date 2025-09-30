'use client';
import { profilesApi } from './api/profiles';
import NotFound from '@app/not-found';
import default_avatar from '@assets/images/default_avatar.png';
import { filterChipOptionsByAggregations } from '@common/filterHelpers';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterProfileMobile } from '@frontend/CategoryPage/constants';
import { useQuery } from '@tanstack/react-query';
import { StaticImageData } from 'next/image';
import React, { useEffect, useMemo } from 'react';
import { ProfileImage, ProfileInformation, ProfileListPost } from './mobile/components';
import styles from './styles/ProfileDetailMobile.module.scss';

type ProfileDetailMobileProps = {
  profileSlug: string;
};

const ProfileDetailMobile: React.FC<ProfileDetailMobileProps> = ({ profileSlug }) => {
  useSyncParamsToState();
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

  // Update imgSrc when profileData becomes available
  useEffect(() => {
    if (profileData?.avatar_url) {
      setImgSrc(profileData.avatar_url);
    }
  }, [profileData?.avatar_url]);

  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url || default_avatar,
  );

  // Filter out AggProjects when aggregations don't contain projects
  const filteredChipOptions = useMemo(() => {
    return filterChipOptionsByAggregations(listFilterProfileMobile, searchAggs);
  }, [searchAggs]);

  return (
    <section className={styles.profile_detail_wrapper}>
      {!profileData ? (
        <NotFound errorMessage="No profile data for this profile id" className="h-full py-10" />
      ) : (
        <section>
          <ProfileImage
            imgSrc={imgSrc}
            setImgSrc={setImgSrc}
            profileData={profileData}
          />
          <div className="-translate-y-[20px]">
            <ProfileInformation profileData={profileData} />
            <ProfileListPost filteredChipOptions={filteredChipOptions} />
          </div>
        </section>
      )}
    </section>
  );
};

export default ProfileDetailMobile;
