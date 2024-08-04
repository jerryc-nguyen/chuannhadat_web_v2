import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import {
  useSuspenseQuery,
  queryOptions,
  isServer,
} from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';

export default function PostList() {
  const { buildFilterParams } = useFilterState();
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

  return (
    <div className='w-full pt-4 relative mx-auto bg-white'>
      <div className='text-secondary-600 px-4'>
        Có{' '}
        <span className='text-secondary-900'>
          {data?.pagination?.total_count}
        </span>{' '}
        tin đăng dành cho bạn
      </div>
      {data?.data.map((product: any) => {
        return <ProductCard key={product?.id} product={product} />;
      })}
    </div>
  );
}
