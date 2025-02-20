'use client';
import React from 'react';
import FilterChips from '@mobile/filter_bds/FilterChips';
import PostList from '@mobile/searchs/PostList';

import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@api/react-query';
import '@styles/pages/mobile/home.scss';

import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { ListTopAuthor } from '@views/home/components/ListTopAuthor';
import { listFilterMobile } from '@mobile/filter_bds/constants';

export default function HomeMobile() {
  useSyncParamsToState();
  const queryClient = getQueryClient();

  return (
    <div className="content-bg-color">
      <div className='mt-4 mb-4'>
        <FilterChips chipOptions={listFilterMobile} />
      </div>

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ListTopAuthor />
          <PostList />
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  );
}
