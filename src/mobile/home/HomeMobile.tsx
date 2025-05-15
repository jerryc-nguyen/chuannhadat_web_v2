'use client';
import FilterChips from '@mobile/filter_bds/FilterChips';
import PostList from '@mobile/searchs/PostList';

import { getQueryClient } from '@api/react-query';
import '@styles/pages/mobile/home.scss';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { listFilterMobile } from '@mobile/filter_bds/constants';
import { ListTopAuthor } from '@views/home/components/ListTopAuthor';

export default function HomeMobile() {
  useSyncParamsToState();
  const queryClient = getQueryClient();

  return (
    <div className="content-bg-color">
      <div className="mb-4 mt-4">
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
