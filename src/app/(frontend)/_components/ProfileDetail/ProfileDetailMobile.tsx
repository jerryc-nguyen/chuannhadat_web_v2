'use client';

import React, { useEffect } from 'react';
import NotFound from '@app/not-found';
import { listFilterProfileMobile } from '@frontend/CategoryPage/constants';
import FilterChipsMobile from '@frontend/CategoryPage/mobile/FilterChips';
import PostList from '@frontend/CategoryPage/mobile/PostList';
import { ProfileImage, ProfileInformation } from './mobile/components';
import { useProfileDetail } from './hooks/useProfileDetail';
import styles from './styles/ProfileDetailMobile.module.scss';
import default_avatar from '@assets/images/default_avatar.png';
import { StaticImageData } from 'next/image';
import { useCleanFilterStates } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useCleanFilterStates';

type ProfileDetailMobileProps = {
  profileSlug: string;
};

const ProfileDetailMobile: React.FC<ProfileDetailMobileProps> = ({ profileSlug }) => {
  useCleanFilterStates();
  const {
    profileData,
    products,
    pagination,
    filterParams,
    filteredChipOptions,
    searchAggs
  } = useProfileDetail({
    profileSlug,
    filterChipsList: listFilterProfileMobile
  });

  // Mobile-specific image state management
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    profileData?.avatar_url || default_avatar,
  );

  // Update imgSrc when profileData becomes available
  useEffect(() => {
    if (profileData?.avatar_url) {
      setImgSrc(profileData.avatar_url);
    }
  }, [profileData?.avatar_url]);

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
            <section className="mb-6">
              <h2 className="mb-4 px-4 text-lg font-semibold">Tin đã đăng</h2>
              <FilterChipsMobile
                chipOptions={filteredChipOptions}
                aggregationData={{
                  busCatTypeOptions: searchAggs.busCatTypeOptions,
                  locationsList: searchAggs.locationsList,
                  projectsOptions: searchAggs.projectsOptions
                }}
              />
              <PostList
                dataPostList={products}
                filterParams={filterParams}
                currentPage={pagination?.current_page || 1}
              />
            </section>
          </div>
        </section>
      )}
    </section>
  );
};

export default ProfileDetailMobile;
