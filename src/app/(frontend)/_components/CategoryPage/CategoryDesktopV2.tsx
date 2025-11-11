'use client';

import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterDesktop } from './constants';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { useFilterChipsUI } from '@frontend/features/search/hooks/useFilterChipsUI';
import useSearchAggs from '@frontend/features/search/search-aggs/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

// Import components from the same feature folder
import PostList from './components/PostList';
import { ListTopAuthor } from './components/ListTopAuthor';
import EmptyPost from './components/EmptyPost';
import useLoadMissingAuthors from './hooks/useLoadMissingAuthors';
import { useFilterStatePresenter } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterStatePresenter';
import useQueryPostsV2 from '@app/(frontend)/_components/features/search/hooks/useQueryPostsV2';
import FilterChipsDesktop from './components/FilterChips';

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

  // Get aggregation data for filters
  const {
    busCatTypeOptions,
    locationsList
  } = useSearchAggs();

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

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <ListTopAuthor />

      <FilterChipsDesktop
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={filteredChipOptions}
        pagination={data?.pagination}
        aggregationData={{
          busCatTypeOptions,
          locationsList
        }}
      />

      <PostList
        dataPostList={products}
        filterParams={APIFilterParams}
        currentPage={currentPage}
      />

      {/* Show empty state when no products found */}
      {products && products.length === 0 && <EmptyPost />}

      {/* Pagination removed - will be replaced with infinite scroll */}
    </section>
  );
};

export default CategoryDesktopV2;
