'use client';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import { FilterFieldName } from '@models';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import ProductCard from './ProductCard';
import { Button } from '@components/ui/button';
import React from 'react';
import { useRefCallback } from '@hooks/useRefCallback';
import Spinner from '@components/ui/spinner';
import usePaginatedData from '@hooks/usePaginatedPost';
import useDebounce from '@hooks/useDebounce';

type PostListProps = {
  isRedirectAfterApplyFilter?: boolean;
};
export default function PostList({ isRedirectAfterApplyFilter = true }: PostListProps) {
  useSyncParamsToState();
  const { openModal3, closeModals } = useModals();
  const {
    buildFilterParams,
    selectedSortText,
    copyFilterStatesToLocal,
    applySortFilter,
    setIsRedirect,
  } = useFilterState();
  React.useEffect(() => {
    setIsRedirect(isRedirectAfterApplyFilter);
  }, []);
  const filterParams = buildFilterParams({
    withLocal: false,
  });

  const { products, isLoading, handleLoadMore, data, currentPage } = usePaginatedData(filterParams);

  const onApplySort = useRefCallback(() => {
    applySortFilter();
    closeModals();
  });
  const renderFooterSortButton = () => (
    <Button className="w-full" onClick={onApplySort}>
      Áp dụng
    </Button>
  );
  const onShowSortOptions = () => {
    copyFilterStatesToLocal([FilterFieldName.Sort]);
    openModal3({
      name: 'sort_bts',
      title: 'Sắp xếp theo',
      content: <SortOptions />,
      footer: renderFooterSortButton(),
    });
  };

  const handleScroll = useDebounce(() => {
    if (
      currentPage <= 2 &&
      data?.pagination.total_count !== products.length &&
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
    <div className="relative mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="text-slate-600">Có {data?.pagination?.total_count} tin đăng</div>
        <div className="flex items-center" onClick={onShowSortOptions}>
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedSortText || 'Sắp xếp'}
          </span>
          <IoChevronDown />
        </div>
      </div>

      {products?.map((product: A) => {
        return <ProductCard key={product?.id} product={product} />;
      })}

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
    </div>
  );
}
