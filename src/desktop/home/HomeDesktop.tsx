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
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@common/utils';
import { usePathname, useRouter } from 'next/navigation';

const HomeDesktop: React.FC = () => {
  useSyncParamsToState();
  const router = useRouter();
  const pathname = usePathname();

  const { buildFilterParams } = useFilterState();
  const { appendCardAuthors } = useCardAuthors();
  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;

  const { products, isLoading, handleLoadMore, data, currentPage, setCurrentPage } =
    usePaginatedData(filterParams);

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
      <PostList dataPostList={products} />
      <ReactPaginate
        className="mb-10 mt-4 flex justify-center gap-1"
        breakLabel="..."
        nextLabel={
          <Button variant={'link'} className="p-1">
            <ChevronRight />
          </Button>
        }
        onPageChange={(page) => {
          const selected = page.selected + 1;
          router.push(pathname + '?page=' + selected);
        }}
        pageRangeDisplayed={2}
        pageCount={data?.pagination.total_pages}
        pageLinkClassName={cn('text-bold h-full flex justify-center items-center p-1')}
        activeLinkClassName={cn('text-blue-500')}
        disabledLinkClassName="opacity-25"
        previousLabel={
          <Button variant={'link'} className="p-1">
            <ChevronLeft />
          </Button>
        }
        renderOnZeroPageCount={null}
      />
    </section>
  );
};

export default HomeDesktop;
