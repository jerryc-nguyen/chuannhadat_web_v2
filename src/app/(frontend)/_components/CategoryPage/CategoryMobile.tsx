'use client';
import FilterChips from './mobile/filter_bds/FilterChips';
import PostList from './mobile/searchs/PostList';

import { getQueryClient } from '@common/api/react-query';
import '@styles/pages/mobile/home.scss';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { useSyncParamsToState } from '@common/hooks/useSyncParamsToState';
import { listFilterMobile } from './mobile/filter_bds/constants';
import { useFilterChipsUI } from '@common/hooks/useFilterChipsUI';

// Import from the same feature folder
import { ListTopAuthor } from './components/ListTopAuthor';

export default function CategoryMobile() {
  useSyncParamsToState();
  const queryClient = getQueryClient();

  // Filter chips based on current filter state
  const { filteredChipOptions } = useFilterChipsUI(listFilterMobile);

  return (
    <div className="content-bg-color">
      <div className="mb-4 mt-4">
        <FilterChips chipOptions={filteredChipOptions} />
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
