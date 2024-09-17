'use client';

import React, { useCallback } from 'react';

import './desktop.scss';
import DesktopFilterChips from '@mobile/filter_bds/DesktopFilterChips';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/PostList';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { searchApi, cardAuthors } from '@api/searchApi';
import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom } from '@desktop/home/states';
import PostControls from '@desktop/home/PostControls';
import useCardAuthors from '@desktop/home/hooks/useCardAuthors';
import { ModalPostDetail } from '@desktop/home/components';
import MainNav from '@desktop/components/MainNav';

export default function Desktop() {
  useSyncParamsToState();
  const { appendCardAuthors } = useCardAuthors();
  const { buildFilterParams } = useFilterState();

  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;
  filterParams.per_page = 12;

  const { data, isFetched } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  useHydrateAtoms([[loadedCardAuthorsAtom, data.users || {}]]);

  useCallback(() => {
    if (isFetched && data.users) {
      setTimeout(() => {
        appendCardAuthors(data.users);
      }, 200);
    }
  }, [isFetched, data.users]);

  const { data: missingAuthors, isFetched: isFetchedMissingAuthors } = useQuery({
    queryKey: ['missing-card-authors', data.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data.missing_user_ids.join(',') }),
  });

  useCallback(() => {
    if (isFetched && data.users) {
      setTimeout(() => {
        appendCardAuthors(data.users);
      }, 200);
    }
  }, [isFetchedMissingAuthors, missingAuthors?.data]);

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
        <ModalPostDetail />
        <PostControls pagination={data?.pagination} />
        <PostList products={data?.data} />
      </main>
    </main>
  );
}
