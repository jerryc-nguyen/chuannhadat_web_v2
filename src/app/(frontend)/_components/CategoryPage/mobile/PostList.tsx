'use client';
import { Button } from '@components/ui/button';
import { useRefCallback } from '@common/hooks/useRefCallback';
import SortOptions from '../../features/search/filter-conditions/bts/SortOptions';
import useFilterState from '../../features/search/filter-conditions/hooks/useFilterState';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { FilterFieldName } from '@common/types';
import { ChevronDown } from 'lucide-react';

import empty_city from '@assets/images/empty-city.png';
import Image from 'next/image';
import InfiniteProductLoaderMobile from './InfiniteProductLoaderMobile';
import { IPostProductCard } from '../states';

type PostListProps = {
  dataPostList: IPostProductCard[];
  filterParams: any;
  currentPage: number;
};

export default function PostList({ dataPostList, filterParams, currentPage }: PostListProps) {

  const { openModal3, closeModals } = useModals();
  const { selectedSortText, copyFilterStatesToLocal, applySortFilter } = useFilterState();

  // Use the passed data instead of fetching internally
  const products = dataPostList;

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

  const _EmptyPost = () => {
    return (
      <section className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
        <Image className="w-full" src={empty_city} alt="no-notification" />
        <h3 className="text-lg font-bold">Không tìm thấy bài đăng</h3>
        <p className="mt-2 w-3/4 text-center text-sm text-foreground">
          Không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều
          kiện khác.
        </p>
      </section>
    );
  };
  return (
    <div className="c-verticalPostList relative mx-auto w-full">
      <div className="flex items-center justify-between px-4 pb-4 pt-0">
        <div className="text-secondary">Có {products?.length || 0} tin đăng</div>
        <div className="flex items-center" onClick={onShowSortOptions}>
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedSortText || 'Sắp xếp'}
          </span>
          <ChevronDown />
        </div>
      </div>

      <InfiniteProductLoaderMobile
        initialProducts={products}
        filterParams={filterParams}
        currentPage={currentPage}
      />

      {/* Show empty state when no products found */}
      {products && products.length === 0 && <_EmptyPost />}
    </div>
  );
}
