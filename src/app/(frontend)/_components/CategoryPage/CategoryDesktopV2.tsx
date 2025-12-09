'use client';

import { listFilterDesktop, PER_PAGE_DESKTOP } from './constants';
import React from 'react';

// Import components from the same feature folder
import PostList from './components/PostList';
import { ListTopAuthor } from './components/ListTopAuthor';
import EmptyPost from './components/EmptyPost';
import FilterChipsDesktop from './components/FilterChips';
import { useCategoryPageController } from './hooks/useCategoryPageController';
import Breadcrumb from '@components/desktop/components/breadcrumb';

type Props = {
  initialFilterState?: Record<string, any>;
  currentContentType?: any;
};

const CategoryDesktopV2: React.FC<Props> = ({ initialFilterState, currentContentType }) => {
  const {
    data,
    products,
    currentPage,
    APIFilterParams,
    filteredChipOptions,
    aggregationData,
    pagination,
    breadcrumbsJsonLD,
    breadcrumbsLinkItems,
    isHomePage
  } = useCategoryPageController({ perPage: PER_PAGE_DESKTOP, listFilterOptions: listFilterDesktop, includeAgg: true, initialFilterState, currentContentType });
  console.log('breadcrumbsJsonLD', breadcrumbsJsonLD);
  return (
    <section className="my-6">
      {!isHomePage && (<div className="my-4 flex justify-between gap-x-4">
        <Breadcrumb breadcrumbs={breadcrumbsLinkItems} isLastLink={true} />
      </div>)}
      {!isHomePage && breadcrumbsJsonLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLD) }}
        />
      )}
      <h1 className="mt-8 text-2xl font-semibold text-primary">{data?.title}</h1>
      <ListTopAuthor />

      <FilterChipsDesktop
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10 py-4"
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
