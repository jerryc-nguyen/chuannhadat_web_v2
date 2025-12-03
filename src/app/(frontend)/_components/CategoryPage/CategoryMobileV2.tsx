'use client';
import FilterChips from './mobile/FilterChips';
import PostList from './mobile/PostList';
import '@styles/pages/mobile/home.scss';
import { listFilterMobile, PER_PAGE_MOBILE } from './constants';

// Import from the same feature folder
import { ListTopAuthor } from './components/ListTopAuthor';
import EmptyPost from './components/EmptyPost';

import React from 'react';
import { useCategoryPageController } from './hooks/useCategoryPageController';

type Props = {
  initialFilterState?: Record<string, any>;
  currentContentType?: any;
};

export default function CategoryMobile({ initialFilterState, currentContentType }: Props) {
  const {
    products,
    totalCount,
    currentPage,
    APIFilterParams,
    filteredChipOptions,
  } = useCategoryPageController({ perPage: PER_PAGE_MOBILE, listFilterOptions: listFilterMobile, includeAgg: false, initialFilterState, currentContentType });

  return (
    <div className="content-bg-color">
      <div className="mb-4 mt-4">
        <FilterChips
          chipOptions={filteredChipOptions}
        />
      </div>

      <ListTopAuthor />
      <PostList
        dataPostList={products}
        filterParams={APIFilterParams}
        currentPage={currentPage}
        totalCount={totalCount}
      />

      {/* Show empty state when no products found */}
      {products && products.length === 0 && <EmptyPost />}
    </div>
  );
}
