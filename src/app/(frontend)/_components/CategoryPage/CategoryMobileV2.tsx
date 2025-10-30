'use client';
import FilterChips from './mobile/FilterChips';
import PostList from './mobile/PostList';

import '@styles/pages/mobile/home.scss';

import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterMobile } from './constants';
import { useFilterChipsUI } from '@frontend/features/search/hooks/useFilterChipsUI';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { useFilterStatePresenter } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterStatePresenter';
import useQueryPostsV2 from '@app/(frontend)/_components/features/search/hooks/useQueryPostsV2';
import useLoadMissingAuthors from './hooks/useLoadMissingAuthors';

// Import from the same feature folder
import { ListTopAuthor } from './components/ListTopAuthor';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

export default function CategoryMobile() {
  useSyncParamsToState();

  const _router = useRouter();
  const _pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  // Use the new pure UI state manager
  const {
    filterState,
    onFieldChanged,
    onClearFilter,
    getFilterValue,
  } = useFilterState();

  const { friendlyParams } = useFilterStatePresenter(filterState);

  const APIFilterParams = useMemo(() => {
    return {
      ...friendlyParams,
      with_title: true,
      with_users: true,
      page: currentPage,
      per_page: 4, // ✅ Load 4 products initially for mobile performance
    };
  }, [friendlyParams, currentPage]);

  const { products, data } = useQueryPostsV2(APIFilterParams);
  useLoadMissingAuthors(data);

  // Filter chips based on current filter state using the new pure UI approach
  const { filteredChipOptions } = useFilterChipsUI(listFilterMobile);

  return (
    <div className="content-bg-color">
      <div className="mb-4 mt-4">
        <FilterChips
          chipOptions={filteredChipOptions}
          selectedFilterState={filterState}
          onFieldChanged={onFieldChanged}
          onClearFilter={onClearFilter}
          getFilterValue={getFilterValue}
        />
      </div>

      <ListTopAuthor />
      <PostList
        dataPostList={products}
        filterParams={APIFilterParams}
        currentPage={currentPage}
      />
    </div>
  );
}
