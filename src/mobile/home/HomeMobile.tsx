'use client';
import React from 'react';
import FilterChips from '@mobile/filter_bds/FilterChips';
import PostList from '@mobile/searchs/PostList';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@api/react-query';
import '@styles/pages/mobile/home.scss';

import TestComponents from './TestComponents';

export default function HomeMobile() {
  const queryClient = getQueryClient();


  return (
    <div className="content-bg-color">
      <TestComponents />
      <FilterChips />

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PostList />
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  );
}
