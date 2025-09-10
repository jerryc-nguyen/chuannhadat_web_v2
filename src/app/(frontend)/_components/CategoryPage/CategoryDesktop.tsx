'use client';
import empty_city from '@assets/images/empty-city.png';
import useQueryPosts from '@hooks/useQueryPosts';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { listFilterDesktop } from './mobile/filter_bds/constants';
import useFilterState from './mobile/filter_bds/hooks/useFilterState';
import { useFilterChipsUI } from '@hooks/useFilterChipsUI';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

// Import components from the same feature folder
import PostControls from './components/PostControls';
import PostList from './components/PostList';
import { ListTopAuthor } from './components/ListTopAuthor';
import useLoadMissingAuthors from './hooks/useLoadMissingAuthors';

const CategoryDesktop: React.FC = () => {
  useSyncParamsToState();

  const _router = useRouter();
  const _pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;
  const { buildFilterParams } = useFilterState();
  let filterParams = buildFilterParams({ withLocal: false });
  filterParams = {
    ...filterParams,
    with_title: true,
    with_users: true,
    page: currentPage,
    per_page: 9, // ✅ Load 8 products initially for better performance
  };

  const { products, data } = useQueryPosts(filterParams);
  useLoadMissingAuthors(data);

  // Filter chips based on current filter state
  const { filteredChipOptions } = useFilterChipsUI(listFilterDesktop);

  const _EmptyPost = () => {
    return (
      <section className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
        <Image className="mb-6 w-2/3" src={empty_city} alt="no-notification" />
        <h3 className="text-2xl font-bold">Không tìm thấy bài đăng</h3>
        <p className="mt-2 w-3/4 text-center text-base text-foreground">
          Không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều
          kiện khác.
        </p>
      </section>
    );
  };

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <ListTopAuthor />

      <PostControls
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={filteredChipOptions}
        pagination={data?.pagination}
      />

      <PostList
        dataPostList={products}
        filterParams={filterParams}
        currentPage={currentPage}
      />

      {/* Pagination removed - will be replaced with infinite scroll */}
    </section>
  );
};

export default CategoryDesktop;
