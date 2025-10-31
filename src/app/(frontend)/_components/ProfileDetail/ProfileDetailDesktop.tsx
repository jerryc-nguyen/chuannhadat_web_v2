'use client';

import React, { useEffect, useMemo } from 'react';
import styles from './styles/profile-detail.module.scss';

import { searchApi } from '@frontend/features/search/api/searchApi';
import { profilesApi } from './api/profiles';
import NotFound from '@app/not-found';
import { filterChipOptionsByAggregations } from '@common/filterHelpers';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterProfileDesktop } from '@frontend/CategoryPage/constants';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { useFilterStatePresenter } from '@frontend/features/search/filters-v2/hooks/useFilterStatePresenter';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import FilterChipsDesktop from '@frontend/CategoryPage/components/FilterChips';
import PostList from '@frontend/CategoryPage/components/PostList';

import { useSearchParams } from 'next/navigation';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {
  useSyncParamsToState();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const { resetLocations } = useMainContentNavigator();
  const {
    updateSearchAggs,
    setIsUseAggOptions,
    busCatTypeOptions,
    locationsList,
    projectsOptions
  } = useSearchAggs();

  // Reset locations when the component mounts
  useEffect(() => {
    resetLocations();
  }, [resetLocations]);

  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => profilesApi.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });

  // Use the new v2 filter state management
  const { filterState } = useFilterState();
  const { friendlyParams } = useFilterStatePresenter(filterState);

  const APIFilterParams = useMemo(() => {
    return {
      ...friendlyParams,
      page: currentPage,
      per_page: 9, // ✅ Load 9 products initially for better performance
      author_slug: profileSlug,
      aggs_for: 'profile',
    };
  }, [friendlyParams, currentPage, profileSlug]);

  const {
    data: { data: products, pagination, aggs: aggreations },
  } = useSuspenseQuery({
    queryKey: ['profile-post', { filterParams: APIFilterParams, profileSlug }, currentPage],
    queryFn: () => searchApi(APIFilterParams),
  });

  useEffect(() => {
    if (aggreations) {
      updateSearchAggs(aggreations);
      setIsUseAggOptions(true);
    }
  }, [aggreations, setIsUseAggOptions, updateSearchAggs]);

  // Filter out AggProjects when aggreations doesn't contain projects or it's empty
  const filteredChipOptions = useMemo(() => {
    return filterChipOptionsByAggregations(listFilterProfileDesktop, aggreations);
  }, [aggreations]);

  return (
    <>
      {!profileData ? (
        <NotFound className="h-full" errorMessage="Nội dung không tồn tại hoặc đã bị xóa" />
      ) : (
        <section className={styles.profile_detail_wrapper}>
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
                  busCatTypeOptions,
                  locationsList,
                  projectsOptions
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
      )}
    </>
  );
};

export default ProfileDetailDesktop;
