'use client';

import React from 'react';

import MainNav from '@desktop/components/MainNav';
import './desktop.scss';
import DesktopFilterChips from '@mobile/filter_bds/DesktopFilterChips';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/PostList';

export default function Desktop() {
  useSyncParamsToState();

  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.per_page = 12;
  console.log('filterParams', filterParams);

  return (
    <main className="c-layout1col">
      <header className="c-content__container shadow-1 sticky top-0 z-10 bg-white">
        <MainNav></MainNav>
      </header>

      <main className="c-content c-content__container">
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tighter">
          Bán đất thổ cư, đất nông nghiệp có giá tốt nhất trên toàn quốc - T8/2024
        </h1>
        <div className="top-50 sticky z-10">
          <DesktopFilterChips />
        </div>

        <PostList />
      </main>

      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
    </main>
  );
}
