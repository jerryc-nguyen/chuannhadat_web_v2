'use client';

import React, { useEffect } from 'react';

import MainNav from '@desktop/components/MainNav';
import './desktop.scss';
import DesktopFilterChips from '@mobile/filter_bds/DesktopFilterChips';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';

import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/PostList';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { searchApi, cardAuthors } from '@api/searchApi';
import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom } from '@desktop/home/states';
import PostControls from '@desktop/home/PostControls';
import useCardAuthors from '@desktop/home/hooks/useCardAuthors';

export default function Desktop() {
  useSyncParamsToState();
  const { appendCardAuthors } = useCardAuthors();

  const { buildFilterParams } = useFilterState();

  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.with_title = true;
  filterParams.with_users = true;
  filterParams.per_page = 12;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  useHydrateAtoms([[loadedCardAuthorsAtom, data.users || {}]]);

  const { data: missingAuthors } = useQuery({
    queryKey: ['missing-card-authors', data.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data.missing_user_ids.join(',') }),
  });

  if (missingAuthors?.data) {
    appendCardAuthors(missingAuthors.data);
  }

  return (
    <main className="c-layout1col">
      <header className="c-content__container shadow-1 sticky top-0 z-10 bg-white">
        <MainNav></MainNav>
      </header>

      <main className="c-content c-content__container">
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tighter">{data?.title}</h1>
        <div className="top-50 sticky z-10">
          <DesktopFilterChips />
        </div>

        <PostControls pagination={data?.pagination} />
        <PostList products={data?.data} />
      </main>

      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
    </main>
  );
}
