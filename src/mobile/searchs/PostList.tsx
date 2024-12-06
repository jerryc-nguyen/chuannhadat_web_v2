'use client';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import { FilterFieldName } from '@models';
import { useEffect } from 'react';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import ProductCard from './ProductCard';
import { Button } from '@components/ui/button';
import React from 'react';
import { useRefCallback } from '@hooks/useRefCallback';
import Spinner from '@components/ui/spinner';
import usePaginatedData from '@hooks/usePaginatedPost';
import useDebounce from '@hooks/useDebounce';

import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@common/utils';
import { usePathname, useRouter } from 'next/navigation';

// TODO: Tách ReactPaginate ra thành một component riêng

export default function PostList() {
  useSyncParamsToState();
  const router = useRouter();
  const pathname = usePathname();

  const { openModal3, closeModals } = useModals();
  const { buildFilterParams, selectedSortText, copyFilterStatesToLocal, applySortFilter } =
    useFilterState();

  const filterParams = buildFilterParams({
    withLocal: false,
  });

  const { products, isLoading, handleLoadMore, data, currentPage, setCurrentPage } =
    usePaginatedData(filterParams);

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

  return (
    <div className="relative mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="text-secondary">Có {data?.pagination?.total_count} tin đăng</div>
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

      <ReactPaginate
        className="mb-10 mt-4 flex justify-center gap-1"
        breakLabel="..."
        nextLabel={
          <Button variant={'link'} className='p-1'>
            <ChevronRight />
          </Button>
        }
        onPageChange={(page) => {
          const selected = page.selected + 1;
          router.push(pathname + "?page=" + selected);
        }}
        pageRangeDisplayed={2}
        pageCount={data?.pagination.total_pages}
        pageLinkClassName={cn('text-bold h-full flex justify-center items-center p-1')}
        activeLinkClassName={cn('text-blue-500')}
        disabledLinkClassName="opacity-25"
        previousLabel={
          <Button variant={'link'} className='p-1'>
            <ChevronLeft />
          </Button>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
