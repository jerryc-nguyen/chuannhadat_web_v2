'use client';
import empty_city from '@assets/images/empty-city.png';
import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterDesktop } from './constants';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { useFilterChipsUI } from '@frontend/features/search/hooks/useFilterChipsUI';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

// Import components from the same feature folder
import PostControlsV2 from './components/PostControlsV2';
import PostList from './components/PostList';
import { ListTopAuthor } from './components/ListTopAuthor';
import useLoadMissingAuthors from './hooks/useLoadMissingAuthors';
import { useFilterStatePresenter } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterStatePresenter';
import { buildFriendlyParams } from '@app/(frontend)/_components/features/search/filters-v2/helpers/friendlyParamsHelper';
import useQueryPostsV2 from '@app/(frontend)/_components/features/search/hooks/useQueryPostsV2';

const CategoryDesktopV2: React.FC = () => {
  useSyncParamsToState();

  const _router = useRouter();
  const _pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  // Use the new pure UI state manager
  const {
    filterState,
  } = useFilterState();

  const { friendlyParams } = useFilterStatePresenter(filterState);

  const APIFilterParams = useMemo(() => {
    return {
      ...friendlyParams,
      with_title: true,
      with_users: true,
      page: currentPage,
      per_page: 9, // ✅ Load 9 products initially for better performance
    };
  }, [friendlyParams, currentPage]);

  const { products, data } = useQueryPostsV2(APIFilterParams);
  useLoadMissingAuthors(data);

  // Filter chips based on current filter state using the new pure UI approach
  const { filteredChipOptions } = useFilterChipsUI(listFilterDesktop);

  // Handle filter changes from PostControlsV2
  const handleFilterChange = React.useCallback((newFilterState: Record<string, any>) => {
    // The PostControlsV2 will trigger filter changes through the FilterChip components
    // which will use the new pure UI architecture
    console.log('Filter changed:', newFilterState);
    const newParams = buildFriendlyParams(newFilterState);
    console.log('New params:', newParams);
  }, []);

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

      <PostControlsV2
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={filteredChipOptions}
        pagination={data?.pagination}
        onFiltersChanged={handleFilterChange}
      />

      <PostList
        dataPostList={products}
        filterParams={APIFilterParams}
        currentPage={currentPage}
      />

      {/* Show empty state when no products found */}
      {products && products.length === 0 && <_EmptyPost />}

      {/* Pagination removed - will be replaced with infinite scroll */}
    </section>
  );
};

export default CategoryDesktopV2;
