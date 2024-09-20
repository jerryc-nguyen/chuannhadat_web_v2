'use client';

import React from 'react';

import MainNav from '@mobile/header/MainNav';

import '@styles/pages/mobile/home.scss';
import FilterModal from '@mobile/filter_bds/FilterModal';
import FilterChips from '@mobile/filter_bds/FilterChips';
import useModals from '@mobile/modals/hooks';
import FooterOverviewBtsButton from '@mobile/filter_bds/FooterOverviewBtsButton';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import PostList from '@mobile/searchs/PostList';
import { dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { getQueryClient } from '@api/react-query';

export default function Mobile() {
  const queryClient = getQueryClient();

  useSyncParamsToState();

  const { openModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();

  const openFilterModal = () => {
    copyFilterStatesToLocal();
    openModal({
      name: 'filter_modal',
      title: 'Lọc',
      content: <FilterModal />,
      maxHeightPercent: 1,
      footer: <FooterOverviewBtsButton />,
    });
  };

  return (
    <div className="content-bg-color">
      <header className="c-content__container shadow-1 sticky top-0 z-10 bg-white px-4 py-3 pt-2">
        <MainNav onSearchClick={() => openFilterModal()}></MainNav>
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
