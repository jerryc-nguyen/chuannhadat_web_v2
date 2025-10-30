'use client';
import FilterChips from '../features/search/filter-conditions/mobile/FilterChips';
import PostList from './mobile/PostList';

import { getQueryClient } from '@common/api/react-query';
import '@styles/pages/mobile/home.scss';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { useSyncParamsToState } from '@frontend/features/search/hooks/useSyncParamsToState';
import { listFilterMobile } from './constants';
import { useFilterChipsUI } from '@frontend/features/search/hooks/useFilterChipsUI';

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
