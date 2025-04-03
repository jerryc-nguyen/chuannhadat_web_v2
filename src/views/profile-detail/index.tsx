'use client';

import React from 'react';
import styles from './styles/profile-detail.module.scss';

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { services } from '@api/services';
import PostList from '@views/home/components/PostList';
import PostControls from '@views/home/components/PostControls';
import { searchApi } from '@api/searchApi';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { listFilterProfileDesktop } from '@mobile/filter_bds/constants';
import NotFound from '@app/not-found';
import ProfileImage from './components/ProfileImage';
import ProfileInfo from './components/ProfileInfo';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import useSearchAggs from '@components/search-aggs/hooks';
import { PostPagination } from '@views/home/components/PostPagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useMainContentNavigator from '@components/main-content-navigator/hooks';
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';

type ProfileDetailDesktopProps = { profileSlug: string };
const ProfileDetailDesktop: React.FC<ProfileDetailDesktopProps> = ({ profileSlug }) => {
  useSyncParamsToState();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const { updateValues } = useMainContentNavigator();

  const { updateSearchAggs, setIsUseAggOptions } = useSearchAggs();

  const { data: profileData } = useQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
    select: (data) => data.data,
  });

  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: false });
  const {
    data: { data: products, pagination, aggs: aggreations },
  } = useSuspenseQuery({
    queryKey: ['profile-post', { filterParams, profileSlug }, currentPage],
    queryFn: () =>
      searchApi({
        ...filterParams,
        page: currentPage,
        author_slug: profileSlug,
        aggs_for: 'profile',
      }),
  });

  if (aggreations) {
    updateSearchAggs(aggreations);
    setIsUseAggOptions(true);
  }

  const onFilterChanged = (filterState: Record<string, A>) => {
    updateValues({
      city: filterState.city,
      district: filterState.district,
      ward: filterState.ward,
    });
  };

  const EmptyPost = () => {
    return (
      <section className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
        <Image className="w-full md:w-1/2" src={empty_city} alt="no-notification" />
        <h3 className="text-lg font-bold">Không tìm thấy nội dung</h3>
        <p className="mt-2 w-3/4 text-center text-sm text-foreground">
          Không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều
          kiện khác.
        </p>
      </section>
    );
  };

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
              <PostControls
                className="mx-1"
                chipOptions={listFilterProfileDesktop}
                pagination={pagination}
                onFilterChange={onFilterChanged}
              />
              <PostList
                className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 2xl:!grid-cols-4"
                dataPostList={products}
                isShowAuthor={false}
              />

              <PostPagination
                total_pages={pagination.total_pages}
                currentPage={currentPage}
                onPageChange={(page) => {
                  const selected = page.selected + 1;
                  // @todo: cần merge params vì có thể path hiện tại đang dùng params khác
                  router.push(pathname + '?page=' + selected);
                }}
                emptyComponent={EmptyPost}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileDetailDesktop;
