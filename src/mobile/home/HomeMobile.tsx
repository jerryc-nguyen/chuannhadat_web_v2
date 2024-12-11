'use client';
import React from 'react';
import FilterChips from '@mobile/filter_bds/FilterChips';
import PostList from '@mobile/searchs/PostList';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@api/react-query';
import '@styles/pages/mobile/home.scss';

import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { ListTopAuthor } from '@desktop/home/components/ListTopAuthor';

export default function HomeMobile() {
  useSyncParamsToState();
  const queryClient = getQueryClient();

  return (
    <div className="content-bg-color">
      <FilterChips />
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ListTopAuthor />
          <PostList />
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  );
}
