'use client';
import { Button } from '@components/ui/button';
import { useRefCallback } from '@common/hooks/useRefCallback';
import SortOptions from '../filter_bds/bts/SortOptions';
import useFilterState from '../filter_bds/hooks/useFilterState';
import useModals from '@components/features/layout/mobile-modals/hooks';
import { FilterFieldName } from '@common/models';
import { ChevronDown } from 'lucide-react';

import empty_city from '@assets/images/empty-city.png';
import useSearchAggs from '@components/features/search/search-aggs/hooks';
import useQueryPosts from '@common/hooks/useQueryPosts';

import useLoadMissingAuthors from '@frontend/CategoryPage/hooks/useLoadMissingAuthors';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import InfiniteProductLoaderMobile from './InfiniteProductLoaderMobile';

// TODO: Move to views/home

export default function PostList() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const { updateSearchAggs, setIsUseAggOptions } = useSearchAggs();
  const currentPage = searchParams?.get('page') ? parseInt(searchParams.get('page') as string) : 1;

  const { openModal3, closeModals } = useModals();
  const { buildFilterParams, selectedSortText, copyFilterStatesToLocal, applySortFilter } =
    useFilterState();

  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.with_users = true;
  filterParams.page = currentPage;
  filterParams.per_page = 4; // ✅ Load 4 products initially for mobile

  const { products, data, aggreations } = useQueryPosts(filterParams);

  useLoadMissingAuthors(data);

  if (aggreations) {
    updateSearchAggs(aggreations);
    setIsUseAggOptions(true);
  }

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

  const EmptyPost = () => {
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
        <div className="text-secondary">Có {data?.pagination?.total_count} tin đăng</div>
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
    </div>
  );
}
