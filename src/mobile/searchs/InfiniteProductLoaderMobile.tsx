'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
import { Skeleton } from '@components/ui/skeleton';
import ProductCardV2 from './ProductCardV2';

interface InfiniteProductLoaderMobileProps {
  initialProducts: A[];
  filterParams: A;
  currentPage: number;
}

export default function InfiniteProductLoaderMobile({
  initialProducts,
  filterParams,
  currentPage,
}: InfiniteProductLoaderMobileProps) {
  // ✅ All hooks must be called at the top level
  const [allProducts, setAllProducts] = useState(initialProducts);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['infinite-products-mobile', filterParams, currentPage],
    queryFn: ({ pageParam = currentPage + 1 }) =>
      searchApi({
        ...filterParams,
        page: pageParam,
        per_page: 8, // Load 8 more products per batch for mobile
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPageNum = currentPage + allPages.length + 1;
      return nextPageNum <= lastPage.pagination.total_pages ? nextPageNum : undefined;
    },
    initialPageParam: currentPage + 1,
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          setHasStartedLoading(true);
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '300px' } // Mobile optimization - start loading earlier
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Update products when new data arrives
  useEffect(() => {
    if (data?.pages) {
      const newProducts = data.pages.flatMap(page => page.data);
      setAllProducts([...initialProducts, ...newProducts]);
    }
  }, [data, initialProducts]);

  // Handle empty state after hooks
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
        <div className="w-full max-w-xs mx-auto mb-6">
          <svg viewBox="0 0 400 300" className="w-full h-auto text-gray-300">
            <rect x="50" y="100" width="300" height="150" fill="currentColor" rx="10" />
            <circle cx="120" cy="140" r="15" fill="white" />
            <circle cx="280" cy="140" r="15" fill="white" />
            <path d="M150 180 Q200 200 250 180" stroke="white" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h3 className="text-lg font-bold">Không tìm thấy bài đăng</h3>
        <p className="mt-2 w-3/4 text-center text-sm text-foreground">
          Không tìm thấy bài đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều kiện khác.
        </p>
      </div>
    );
  }

  return (
    <>
      {allProducts?.map((product: A, index: number) => (
        <ProductCardV2 key={product?.id} product={product} productIndex={index} />
      ))}

      <div ref={loadMoreRef} className="w-full">
        {isFetchingNextPage && (
          <div className="space-y-4 px-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {hasStartedLoading && !hasNextPage && !isFetchingNextPage && (
          <div className="text-center py-8 text-muted-foreground px-4">
            <p>🎉 Bạn đã xem hết tất cả bài đăng!</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500 px-4">
            <p>Có lỗi xảy ra khi tải thêm bài đăng. Vui lòng thử lại.</p>
          </div>
        )}
      </div>
    </>
  );
}
