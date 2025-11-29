'use client';

import { listFilterDesktop } from './constants';
import React from 'react';

// Import components from the same feature folder
import PostList from './components/PostList';
import { ListTopAuthor } from './components/ListTopAuthor';
import EmptyPost from './components/EmptyPost';
import FilterChipsDesktop from './components/FilterChips';
import { useCategoryPageController } from './hooks/useCategoryPageController';

const CategoryDesktopV2: React.FC = () => {
  const {
    data,
    products,
    currentPage,
    APIFilterParams,
    filteredChipOptions,
    aggregationData,
    pagination,
  } = useCategoryPageController({ perPage: 9, listFilterOptions: listFilterDesktop, includeAgg: true });

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <ListTopAuthor />

      <FilterChipsDesktop
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={filteredChipOptions}
        pagination={pagination}
        aggregationData={aggregationData}
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
