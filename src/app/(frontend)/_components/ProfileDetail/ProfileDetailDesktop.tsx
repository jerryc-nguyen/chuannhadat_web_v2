'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';
import NotFound from '@app/not-found';
import FilterChipsDesktop from '@frontend/CategoryPage/components/FilterChips';
import PostList from '@frontend/CategoryPage/components/PostList';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';
import { useProfileDetail } from './hooks/useProfileDetail';
import { listFilterProfileDesktop } from '@frontend/CategoryPage/constants';
import { useCleanFilterStates } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useCleanFilterStates';
import JsonLds from '@frontend/commons/jsonlds';

type ProfileDetailDesktopProps = { profileSlug: string; initialFilterState?: Record<string, any> };

export default function ProfileDetailDesktop({ profileSlug, initialFilterState }: ProfileDetailDesktopProps) {
  useCleanFilterStates();

  const {
    profileData,
    isProfileLoading,
    filteredChipOptions,
    products,
    pagination,
    currentPage,
    searchAggs,
    APIFilterParams
  } = useProfileDetail({
    profileSlug,
    filterChipsList: listFilterProfileDesktop,
    initialFilterState,
  });

  if (isProfileLoading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <NotFound />;
  }

  return (
    <section className={styles.profile_detail_wrapper}>
      <JsonLds jsonLds={profileData.json_lds} />
      <ProfileImage profileData={profileData} />
      <div className="flex flex-col gap-x-10 gap-y-10 sm:flex-row">
        <ProfileInfo profileData={profileData} />
        <div className="relative flex-1">
          <h2 className="text-2xl font-bold">Tin đã đăng</h2>
          <FilterChipsDesktop
            className="mx-1"
            chipOptions={filteredChipOptions}
            pagination={pagination}
            aggregationData={{
              busCatTypeOptions: searchAggs.busCatTypeOptions,
              locationsList: searchAggs.locationsList,
              projectsOptions: searchAggs.projectsOptions
            }}
          />
          <PostList
            className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-4"
            dataPostList={products}
            isShowAuthor={false}
            filterParams={APIFilterParams}
            currentPage={currentPage}
          />
        </div>
      </div>
    </section>
  );
}
