import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import {
  useSuspenseQuery,
  queryOptions,
} from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FooterSortBtsButton from '@mobile/filter_bds/FooterSortBtsButton';
import { FilterFieldName } from '@models';

export default function PostList() {
  const { openModal3 } = useModals();
  const {
    buildFilterParams,
    selectedSortText,
    copyFilterStatesToLocal,
  } = useFilterState();
  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.per_page = 12;
  console.log('filterParams', filterParams);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: async () => {
        const response = await searchApi(filterParams);

        return response;
        // return response.json();
      },
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

  return (
    <div className="relative mx-auto w-full">
      <div className="flex items-center justify-between px-4">
        <div className="text-slate-600">
          Có {data?.pagination?.total_count} tin đăng
        </div>
        <div
          className="flex items-center"
          onClick={onShowSortOptions}
        >
          <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedSortText}
          </span>
          <IoChevronDown />
        </div>
      </div>

      {data?.data.map((product: A) => {
        return (
          <ProductCard
            key={product?.id}
            product={product}
          />
        );
      })}
    </div>
  );
}
