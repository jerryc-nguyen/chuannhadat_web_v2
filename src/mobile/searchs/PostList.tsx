'use client';
import { Button } from '@components/ui/button';
import usePaginatedData from '@hooks/usePaginatedPost';
import { useRefCallback } from '@hooks/useRefCallback';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@models';
import { IoChevronDown } from 'react-icons/io5';
import ProductCard from './ProductCard';

import { PostPagination } from '@desktop/home/components/PostPagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// TODO: Move to views/home

export default function PostList() {
  useSyncParamsToState();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

      <PostPagination
        total_pages={data.pagination.total_pages}
        currentPage={searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1}
        onPageChange={(page) => {
          const selected = page.selected + 1;
          router.push(pathname + '?page=' + selected);
        }}
      />
    </div>
  );
}
