import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { isServer, useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import ProductCard from './ProductCard';
import PostControls from './PostControls';

import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom, seoInfoAtom } from './states';
import { useEffect } from 'react';
import { useAtom } from 'jotai';

export default function PostList() {
  const { buildFilterParams } = useFilterState();
  const [seoInfo, setSeoInfo] = useAtom(seoInfoAtom);

  const filterParams = buildFilterParams({
    withLocal: false,
  });
  filterParams.with_users = true;
  filterParams.per_page = 12;
  filterParams.with_seo_info = true;
  console.log('filterParams!!!', filterParams);

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  console.log('data.seo_info', data.seo_info);

  useHydrateAtoms([[loadedCardAuthorsAtom, data.users || {}]]);

  useEffect(() => {
    console.log('data.seo_infodata.seo_info', data.seo_info);
    setSeoInfo(data.seo_info);
  }, [data]);

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
