'use client';
import { cardAuthors } from '@api/searchApi';
import PostControls from '@desktop/home/components/PostControls';
import PostList from '@desktop/home/components/PostList';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import { listFilterDesktop } from '@mobile/filter_bds/constants';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useQuery } from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { PostPagination } from './components/PostPagination';
import useCardAuthors from './hooks/useCardAuthors';
import { loadedCardAuthorsAtom } from './states';
import useQueryPosts from '@hooks/useQueryPosts';
import { ListTopAuthor } from './components/ListTopAuthor';

const HomeDesktop: React.FC = () => {
  useSyncParamsToState();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1
  const { buildFilterParams } = useFilterState();
  const { appendCardAuthors } = useCardAuthors();
  let filterParams = buildFilterParams({ withLocal: false });

  filterParams = {
    ...filterParams,
    with_title: true,
    with_users: true,
    page: currentPage
  }

  const { products, data } = useQueryPosts(filterParams);

  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);
  useEffect(() => {
    if (data?.users) {
      appendCardAuthors(data?.users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.users]);

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

  return (
    <section className="my-10">
      <h1 className="mb-4 text-2xl font-semibold text-primary">{data?.title}</h1>
      <PostControls
        className="w-[calc(100vw-8px)] -translate-x-5 px-5 md:-translate-x-10 md:px-10"
        chipOptions={listFilterDesktop}
        pagination={data?.pagination}
      />
      <ListTopAuthor />
      <PostList dataPostList={products} />

      <PostPagination
        total_pages={data.pagination.total_pages}
        currentPage={currentPage}
        onPageChange={(page) => {
          const selected = page.selected + 1;
          // @todo: cần merge params vì có thể path hiện tại đang dùng params khác
          router.push(pathname + '?page=' + selected);
        }}
      />
    </section>
  );
};

export default HomeDesktop;
