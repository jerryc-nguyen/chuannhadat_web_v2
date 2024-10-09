import { useLayoutEffect, useState } from 'react';
import { useSuspenseQuery, queryOptions } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';

interface FilterParams {
  [key: string]: any; 
  per_page?: number;
  page?: number;
}

function usePaginatedData(filterParams: FilterParams, initialPage = 1, itemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);

  // Cập nhật filterParams với trang hiện tại và số lượng items mỗi trang
  filterParams.per_page = itemsPerPage;
  filterParams.page = currentPage;

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['home', filterParams],
      queryFn: () => searchApi(filterParams),
    }),
  );

  useLayoutEffect(() => {
    if (data) {
        setProducts((prevProducts) => {
            const existingIds = new Set(prevProducts.map((product) => product.id));
            const newProducts = data.data.filter((product: any) => !existingIds.has(product.id));
            return [...prevProducts, ...newProducts];
          });
      setLoading(false);
    }
  }, [data]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => setCurrentPage((prevPage) => prevPage + 1), 1000);
  };

  return { products, isLoading, handleLoadMore, data, currentPage };
}

export default usePaginatedData;
