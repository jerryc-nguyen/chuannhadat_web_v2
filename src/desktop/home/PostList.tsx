import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import PostControls from './PostControls';

export default function PostList() {
  const { buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.per_page = 12;
  console.log('filterParams', filterParams);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  return (
    <>
      <PostControls pagination={data?.pagination} />

      <div className="c-content__gridWrap">
        <div className="c-content__grid">
          {data?.data.map((product: A) => {
            return (
              <div
                key={product?.id}
                className="min-720:gap-y-5 group relative flex flex-col gap-y-5"
              >
                <div className="min-720:rounded-28 min-720:bg-bg-secondary min-720:px-28 min-720:pb-28 min-720:pt-24 relative p-[1px]">
                  <ProductCard key={product?.id} product={product} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
