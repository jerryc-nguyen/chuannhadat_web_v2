'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { Button } from '@components/ui/button';
import { IoChevronDown } from 'react-icons/io5';

export default function Desktop() {
  useSyncParamsToState();
  const { appendCardAuthors } = useCardAuthors();
  const { buildFilterParams } = useFilterState();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<A[]>([]);
  const [showLoadMore, setShowLoadMore] = useState(false);

  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.with_title = true;
  filterParams.with_users = true;
  filterParams.per_page = 12;
  filterParams.page = currentPage;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);

  const { data: missingAuthors } = useQuery({
    queryKey: ['missing-card-authors', data.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data.missing_user_ids.join(',') }),
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
  }, [missingAuthors]);

  useLayoutEffect(() => {
    if (data) {
      setProducts((prevProducts) => {
        const existingIds = new Set(prevProducts.map(product => product.id)); 
        const newProducts = data.data.filter((product: any) => !existingIds.has(product.id)); 
        return [...prevProducts, ...newProducts];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && postRef.current) {
        const { scrollTop, clientHeight } = containerRef.current;
        const postPosition = postRef.current.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top;

        if (postPosition - scrollTop <= clientHeight - 20) {
          setShowLoadMore(true);
        } else {
          setShowLoadMore(false);
        }
      }
    };

    const divElement = containerRef.current;
    if (divElement) {
      divElement.addEventListener('scroll', handleScroll);
    }

    handleScroll();

    return () => {
      if (divElement) {
        divElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [containerRef, postRef]);

  return (
    <main className="c-layout1col">
      <header className="c-content__container shadow-1 sticky top-0 z-10 bg-white">
        <MainNav />
      </header>

      <main className="c-content c-content__container" ref={containerRef}>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tighter">{data?.title}</h1>
        <div className="top-50 sticky z-10">
          <DesktopFilterChips />
        </div>
        <PostControls pagination={data?.pagination} />
        <PostList postRef={postRef} products={products} />
        
        {showLoadMore && (
          <Button className="m-auto load-more-button animate-bounce text-[24px] text-blue-400" variant={"link"} onClick={handleLoadMore}>
            Xem thêm <IoChevronDown className='ml-2'/>
          </Button>
        )}
        <ModalPostDetail />
      </main>
    </main>
  );
}
