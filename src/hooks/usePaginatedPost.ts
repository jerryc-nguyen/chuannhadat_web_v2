import { useEffect, useLayoutEffect, useState } from 'react';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';

interface FilterParams {
  [key: string]: any; 
  per_page?: number;
  page?: number;
}

function usePaginatedData(filterParams: FilterParams, initialPage = 1, itemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setLoading] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [prevFilterParams, setPrevFilterParams] = useState<FilterParams>({});

  filterParams.per_page = itemsPerPage;
  filterParams.page = currentPage;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  const [products, setProducts] = useState<any[]>(data.data);

  useEffect(() => {
    const { per_page, page, ...restCurrentParams } = filterParams;
    const { per_page: prevPerPage, page: prevPage, ...restPrevParams } = prevFilterParams;

    const hasChanged = JSON.stringify(restCurrentParams) !== JSON.stringify(restPrevParams);

    if (hasChanged) {
      setCurrentPage(1);
      setShouldReset(true);
      setPrevFilterParams(filterParams); 
    }
  }, [filterParams]);

  useLayoutEffect(() => {
    if (data) {
      if (shouldReset) {
        setProducts(data.data);
        setShouldReset(false);
      } else {
        setProducts((prevProducts) => {
          const existingIds = new Set(prevProducts.map((product) => product.id));
          const newProducts = data.data.filter((product: any) => !existingIds.has(product.id));
          return [...prevProducts, ...newProducts];
        });
      }
      setLoading(false);
    }
  }, [data, shouldReset]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => setCurrentPage((prevPage) => prevPage + 1), 1000);
  };

  return { products, isLoading, handleLoadMore, data, currentPage };
}

export default usePaginatedData;
