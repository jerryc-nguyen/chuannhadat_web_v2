'use client';

import React from 'react';
import MainNav from '@mobile/header/MainNav';
import FilterChips from '@mobile/filter_bds/FilterChips';
import PostList from '@mobile/searchs/PostList';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { getQueryClient } from '@api/react-query';

import '@styles/pages/mobile/home.scss';

export default function Mobile() {
  const queryClient = getQueryClient();

  useSyncParamsToState();

  return (
    <div className="content-bg-color">
      <header className="c-content__container shadow-1 sticky top-0 z-10 bg-white px-4 py-3 pt-2">
        <MainNav />
      </header>

      <FilterChips />

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostList />
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  );
}
