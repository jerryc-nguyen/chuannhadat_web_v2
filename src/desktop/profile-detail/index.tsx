'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import PostList from '@desktop/home/components/PostList';
import PostControls from '@desktop/home/components/PostControls';
import { searchApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { listFilterProfileDesktop } from '@mobile/filter_bds/constants';
import NotFound from '@app/not-found';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import useSearchAggs from '@components/search-aggs/hooks';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {
  useSyncParamsToState();
  const { updateSearchAggs, setIsUseAggOptions } = useSearchAggs();

  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });

  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: false });
  const { data: { data: products, pagination, aggs: aggreations } } = useSuspenseQuery({
    queryKey: ['profile-post', { filterParams, profileSlug }],
    queryFn: () =>
      searchApi({
        ...filterParams,
        author_slug: profileSlug,
        aggs_for: 'profile'
      }),
  });

  if (aggreations) {
    updateSearchAggs(aggreations)
    setIsUseAggOptions(true);
  }

  return (
    <>
      {!profileData ? (
        <NotFound className="h-full" errorCode={404} errorMessage="Not Found Data Of Profile" />
      ) : (
        <section className={styles.profile_detail_wrapper}>
          <ProfileImage profileData={profileData} />
          <div className="flex flex-col gap-x-10 gap-y-10 sm:flex-row">
            <ProfileInfo profileData={profileData} />

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary_color">Tin đã đăng</h2>
              <div className="my-2">
                <PostControls chipOptions={listFilterProfileDesktop} pagination={pagination} />
              </div>
              <PostList
                className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-4"
                dataPostList={products}
                isShowAuthor={false}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileDetailDesktop;
