import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import {
  useSuspenseQuery,
  queryOptions,
  isServer,
} from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FooterSortBtsButton from '@mobile/filter_bds/FooterSortBtsButton';
import { FilterFieldName } from '@app/types';

export default function PostList() {
  const { openModal3 } = useModals();
  const {
    buildFilterParams,
    selectedSortText,
    copyFilterStatesToLocal,
  } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: false });
  filterParams.per_page = 12;
  console.log('filterParams', filterParams);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: async () => {
        const response = await searchApi(filterParams);

        return response.json();
      },
    })
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
    <div className='w-full relative mx-auto'>
      <div className='flex px-4 justify-between items-center'>
        <div className='text-slate-600'>
          Có {data?.pagination?.total_count} tin đăng
        </div>
        <div
          className='flex items-center'
          onClick={onShowSortOptions}
        >
          <span className='mr-2 text-ellipsis whitespace-nowrap max-w-32 overflow-hidden'>
            {selectedSortText}
          </span>
          <IoChevronDown />
        </div>
      </div>

      {data?.data.map((product: any) => {
        return <ProductCard key={product?.id} product={product} />;
      })}
    </div>
  );
}
