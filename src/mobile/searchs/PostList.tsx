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
import Image from 'next/image';
import empty_city from '@assets/images/empty-city.png';

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

  const { products, data } = usePaginatedData(filterParams);

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
        emptyComponent={EmptyPost}
      />
    </div>
  );
}
