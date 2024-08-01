import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import {
  useQuery,
  useSuspenseQuery,
  isServer,
} from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import { homeApiOptions } from '@app/(home)/apis';

export default function PostList() {
  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams();
  filterParams.per_page = 12;
  console.log('filterParams', filterParams);

  const { data } = useSuspenseQuery(homeApiOptions);

  // const clientData = useQuery({
  //   queryKey: ['searchs-products', filterParams],
  //   queryFn: async () => {
  //     const response = await searchApi(filterParams);
  //     return await response.json();
  //   },
  // });

  return (
    <div className='w-full pt-4 relative mx-auto px-4 bg-white'>
      <div className='text-secondary-600'>
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
