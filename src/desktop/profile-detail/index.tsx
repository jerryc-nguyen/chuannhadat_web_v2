'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import PostList from '@desktop/home/components/PostList';
import PostControls from '@desktop/home/components/PostControls';
import { searchApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';

import NotFound from '@app/not-found';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {

  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });

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
                <PostControls isRedirectAfterApplyFilter={false} pagination={data?.pagination} />
              </div>
              <PostList
                className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-4"
                dataPostList={data?.data}
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
