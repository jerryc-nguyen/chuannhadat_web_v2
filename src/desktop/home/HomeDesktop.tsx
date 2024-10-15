'use client';
import React, { useMemo, useEffect } from 'react';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import PostList from '@desktop/home/components/PostList';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useQuery } from '@tanstack/react-query';
import { cardAuthors } from '@api/searchApi';
import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom } from '@desktop/home/states';
import PostControls from '@desktop/home/components/PostControls';
import useCardAuthors from '@desktop/home/hooks/useCardAuthors';
import { Button } from '@components/ui/button';
import Spinner from '@components/ui/spinner';
import usePaginatedData from '@hooks/usePaginatedPost';
import useDebounce from '@hooks/useDebounce';

const HomeDesktop: React.FC = () => {
  useSyncParamsToState();
  const { appendCardAuthors } = useCardAuthors();
  const { buildFilterParams } = useFilterState();

  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;

  const { products, isLoading, handleLoadMore, data, currentPage } = usePaginatedData(filterParams);

  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);

  const { data: missingAuthors } = useQuery({
    queryKey: ['missing-card-authors', data?.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data?.missing_user_ids.join(',') }),
    enabled: !!data?.missing_user_ids,
  });

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
  }, [missingAuthors, appendCardAuthors, data?.users]);

  const handleScroll = useDebounce(() => {
    if (
      currentPage <= 2 &&
      data.pagination.total_count !== products.length &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      handleLoadMore();
    }
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, handleScroll]);

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary_color">{data?.title}</h1>
      <PostControls pagination={data?.pagination} />
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
