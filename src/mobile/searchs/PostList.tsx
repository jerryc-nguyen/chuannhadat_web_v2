import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FooterSortBtsButton from '@mobile/filter_bds/FooterSortBtsButton';
import { FilterFieldName } from '@models';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'react-day-picker';

export default function PostList() {
  const { openModal3 } = useModals();
  const { buildFilterParams, selectedSortText, copyFilterStatesToLocal } = useFilterState();
  const filterParams = buildFilterParams({
    withLocal: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<A[]>([]);
  const [showLoadMore, setShowLoadMore] = useState(false);

  filterParams.per_page = 12;
  filterParams.page = currentPage;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  const onShowSortOptions = () => {
    copyFilterStatesToLocal([FilterFieldName.sort]);
    openModal3({
      name: 'sort_bts',
      title: 'Sắp xếp theo',
      content: <SortOptions />,
      footer: <FooterSortBtsButton />,
    });
  };

  useLayoutEffect(() => {
    if (data) {
      setProducts((prevProducts) => {
        const existingIds = new Set(prevProducts.map((product) => product.id));
        const newProducts = data.data.filter((product: A) => !existingIds.has(product.id));
        return [...prevProducts, ...newProducts];
      });
    }
  }, [data]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="relative mx-auto w-full">
      <div className="flex items-center justify-between px-4">
        <div className="text-slate-600">Có {data?.pagination?.total_count} tin đăng</div>
        <div className="flex items-center" onClick={onShowSortOptions}>
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedSortText}
          </span>
          <IoChevronDown />
        </div>
      </div>

      {products?.map((product: A) => {
        return <ProductCard key={product?.id} product={product} />;
      })}

      <Button
        className="load-more-button m-auto animate-bounce text-[20px] text-blue-400 m-auto flex items-center"
        onClick={handleLoadMore}
      >
        Xem thêm <IoChevronDown className="ml-2" />
      </Button>
    </div>
  );
}
