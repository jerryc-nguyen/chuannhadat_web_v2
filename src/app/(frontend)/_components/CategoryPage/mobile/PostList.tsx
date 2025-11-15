'use client';
import SortOptionsModalContent from './SortOptionsModalContent';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { ChevronDown } from 'lucide-react';
import InfiniteProductLoaderMobile from './InfiniteProductLoaderMobile';
import { IPostProductCard } from '../states';

type PostListProps = {
  dataPostList: IPostProductCard[];
  filterParams: any;
  currentPage: number;
};

export default function PostList({ dataPostList, filterParams, currentPage }: PostListProps) {

  const { openModal3 } = useModals();
  const { filterState } = useFilterState();

  // Use the passed data instead of fetching internally
  const products = dataPostList;


  const onShowSortOptions = () => {
    openModal3({
      name: 'sort_bts',
      title: 'Sắp xếp theo',
      content: <SortOptionsModalContent />,
    });
  };


  return (
    <div className="c-verticalPostList relative mx-auto w-full">
      <div className="flex items-center justify-between px-4 pb-4 pt-0">
        <div className="text-secondary">Có {products?.length || 0} tin đăng</div>
        <div className="flex items-center" onClick={onShowSortOptions}>
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {filterState.sort?.text || 'Sắp xếp'}
          </span>
          <ChevronDown />
        </div>
      </div>

      <InfiniteProductLoaderMobile
        initialProducts={products}
        filterParams={filterParams}
        currentPage={currentPage}
      />

    </div>
  );
}
