'use client';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import { FilterFieldName } from '@models';
import { useSyncParamsToState } from '@hooks/useSyncParamsToState';
import ProductCard from './ProductCard';
import { Button } from '@components/ui/button';
import React from 'react';
import { useRefCallback } from '@hooks/useRefCallback';
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

  filterParams.per_page = 12;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

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
        <div className="text-slate-600">Có {data?.pagination?.total_count} tin đăng</div>
        <div className="flex items-center" onClick={onShowSortOptions}>
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedSortText || 'Sắp xếp'}
          </span>
          <IoChevronDown />
        </div>
      </div>

      {data?.data.map((product: A) => {
        return <ProductCard key={product?.id} product={product} />;
      })}
    </div>
  );
}
