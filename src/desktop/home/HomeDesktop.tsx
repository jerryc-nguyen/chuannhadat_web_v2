'use client';
import React, { useMemo } from 'react';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/components/PostList';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { searchApi, cardAuthors } from '@api/searchApi';
import { useHydrateAtoms } from 'jotai/utils';
import { dataPostListAtom, loadedCardAuthorsAtom } from '@desktop/home/states';
import PostControls from '@desktop/home/components/PostControls';
import useCardAuthors from '@desktop/home/hooks/useCardAuthors';
import { useSetAtom } from 'jotai';

export default function HomeDesktop() {
  useSyncParamsToState();
  const { appendCardAuthors } = useCardAuthors();
  const { buildFilterParams } = useFilterState();

  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;
  filterParams.per_page = 12;

  const { data, isSuccess } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);

  const { data: missingAuthors } = useQuery({
    queryKey: ['missing-card-authors', data?.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data?.missing_user_ids.join(',') }),
    enabled: !!data?.missing_user_ids,
  });
  const setDataPostList = useSetAtom(dataPostListAtom);
  if (isSuccess) {
    setDataPostList(data.data);
  }
  useMemo(() => {
    if (missingAuthors?.data) {
      setTimeout(() => {
        let loadingAuthors = missingAuthors?.data;
        if (data?.users) {
          loadingAuthors = { ...loadingAuthors, ...data?.users };
        }
        appendCardAuthors(loadingAuthors);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingAuthors]);

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary_color">Tin đăng mới nhất</h1>
      <p>{data?.title}</p>
      <PostControls pagination={data?.pagination} />
      <PostList />
    </section>
  );
}
