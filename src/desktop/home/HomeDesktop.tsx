'use client';
import React, { useEffect } from 'react';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/components/PostList';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import PostControls from '@desktop/home/components/PostControls';
import { Button } from '@components/ui/button';
import Spinner from '@components/ui/spinner';
import usePaginatedData from '@hooks/usePaginatedPost';
import useDebounce from '@hooks/useDebounce';
import useCardAuthors from './hooks/useCardAuthors';
import { cardAuthors } from '@api/searchApi';
import { useQuery } from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom } from './states';
import { listFilterDesktop } from '@mobile/filter_bds/constants';

const HomeDesktop: React.FC = () => {
  useSyncParamsToState();
  const { buildFilterParams } = useFilterState();
  const { appendCardAuthors } = useCardAuthors();
  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;

  const { products, isLoading, handleLoadMore, data, currentPage } = usePaginatedData(filterParams);

  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);
  useEffect(() => {
    if (data?.users) {
      appendCardAuthors(data?.users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.users]);
  const handleScroll = useDebounce(() => {
    if (
      currentPage <= 2 &&
      data.pagination.total_count !== products.length &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      // handleLoadMore();
    }
  }, 200);
  const { data: missingAuthors, isSuccess } = useQuery({
    queryKey: ['missing-card-authors', data.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data.missing_user_ids.join(',') }),
    enabled: !!data.missing_user_ids,
    select: (data) => data.data,
  });
  React.useEffect(() => {
    if (missingAuthors && isSuccess) {
      appendCardAuthors(missingAuthors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, handleScroll]);

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <PostControls
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={listFilterDesktop}
        pagination={data?.pagination}
      />
      <PostList dataPostList={products} />
      {data?.pagination.total_count !== products.length &&
        (currentPage > 2 && !isLoading && products.length > 0 ? (
          <Button
            className="load-more-button m-auto mt-2 w-full animate-bounce text-[24px] text-blue-400"
            variant={'link'}
            onClick={handleLoadMore}
          >
            Xem thêm
          </Button>
        ) : (
          <div className="m-auto mt-2 flex w-full justify-center">
            <Spinner />
          </div>
        ))}
    </section>
  );
};

export default HomeDesktop;
