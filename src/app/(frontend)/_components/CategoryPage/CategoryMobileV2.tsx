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
import Breadcrumb from '@components/desktop/components/breadcrumb';

type Props = {
  initialFilterState?: Record<string, any>;
  currentContentType?: any;
};

export default function CategoryMobile({ initialFilterState, currentContentType }: Props) {
  const {
    data,
    products,
    totalCount,
    currentPage,
    APIFilterParams,
    filteredChipOptions,
    breadcrumbsLinkItems,
    breadcrumbsJsonLD,
    isHomePage
  } = useCategoryPageController({ perPage: PER_PAGE_MOBILE, listFilterOptions: listFilterMobile, includeAgg: false, initialFilterState, currentContentType });

  return (
    <section className="content-bg-color my-6">
      {!isHomePage && (
        <div className="mx-4 my-4 flex justify-between gap-x-4">
          <Breadcrumb breadcrumbs={breadcrumbsLinkItems} isLastLink={true} />
        </div>
      )}

      {!isHomePage && breadcrumbsJsonLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLD) }}
        />
      )}

      <h1 className="p-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <div className="mb-4">
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
    </section>
  );
}
