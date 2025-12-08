'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { Skeleton } from '@components/ui/skeleton';
import { Button } from '@components/ui/button';
import ProductCard from './ProductCard';
import useCardAuthors from '../hooks/useCardAuthors';
import { PER_PAGE_DESKTOP } from '@frontend/CategoryPage/constants';

const AUTO_LOAD_PAGES = 5;

interface InfiniteProductLoaderProps {
  initialProducts: A[];
  filterParams: A;
  currentPage: number;
  isShowAuthor?: boolean;
  autoLoadPages?: number; // Number of pages to auto-load before showing "Load More" button
}

export default function InfiniteProductLoader({
  initialProducts,
  filterParams,
  currentPage,
  isShowAuthor = true,
  autoLoadPages = AUTO_LOAD_PAGES,
}: InfiniteProductLoaderProps) {
  // ✅ All hooks must be called at the top level
  const [allProducts, setAllProducts] = useState(initialProducts);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const { appendCardAuthors } = useCardAuthors();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['infinite-products', filterParams, currentPage],
    queryFn: ({ pageParam = currentPage + 1 }) =>
      searchApiV2({
        ...filterParams,
        page: pageParam,
        per_page: PER_PAGE_DESKTOP, // Load more products per batch using desktop page size
        with_users: true, // ✅ Include users data for authors
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPageNum = currentPage + allPages.length + 1;
      return nextPageNum <= lastPage.pagination.total_pages ? nextPageNum : undefined;
    },
    initialPageParam: currentPage + 1,
    // Avoid initial fetch; rely on guarded IntersectionObserver and button to load
    enabled: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reset local product state when the initial products or filters change
  useEffect(() => {
    setAllProducts(initialProducts);
    setPagesLoaded(0);
    setTotalPages(null);
    setIsAutoLoading(true);
    setHasStartedLoading(false);
  }, [initialProducts, filterParams]);

  // Auto-load first X pages, using a guarded intersection observer to avoid extra queries
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Guard: allow fetch when totalPages unknown, otherwise ensure remaining pages exist
        const canLoadMore =
          totalPages === null || pagesLoaded < Math.max(0, totalPages - currentPage);

        if (entry.isIntersecting && !isFetchingNextPage && isAutoLoading && canLoadMore) {
          setHasStartedLoading(true);
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    // Only observe during auto-loading phase
    if (isAutoLoading) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isFetchingNextPage, fetchNextPage, isAutoLoading, totalPages, pagesLoaded, currentPage]);

  // Update products and authors when new data arrives
  useEffect(() => {
    if (data?.pages) {
      const newProducts = data.pages.flatMap(page => page.data);
      setAllProducts([...initialProducts, ...newProducts]);

      // Track pages loaded and switch to manual loading after autoLoadPages
      const currentPagesLoaded = data.pages.length;
      setPagesLoaded(currentPagesLoaded);

      // Set total pages from the first page's pagination data
      if (data.pages[0]?.pagination?.total_pages && totalPages === null) {
        setTotalPages(data.pages[0].pagination.total_pages);
      }

      if (currentPagesLoaded >= autoLoadPages) {
        setIsAutoLoading(false);
      }

      // ✅ Append authors data from all pages (now safe with memoized appendCardAuthors)
      data.pages.forEach(page => {
        if (page.users) {
          appendCardAuthors(page.users);
        }
      });
    }
  }, [data, initialProducts, appendCardAuthors, autoLoadPages, totalPages]);

  return (
    <>
      {/* Render all products */}
      {allProducts?.map((product, index) => (
        <ProductCard
          isShowAuthor={isShowAuthor}
          product={product}
          key={product?.id}
          isFirstProduct={index === 0}
          productIndex={index}
        />
      ))}

      {/* Loading trigger element for auto-loading */}
      <div ref={loadMoreRef} className="w-full col-span-full">
        {/* Show Load More button after auto-loading is complete */}
        {!isAutoLoading && hasNextPage && !isFetchingNextPage && (
          <div className="flex flex-col items-center justify-center py-8">
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Tải thêm tin đăng
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Đã tải {pagesLoaded}{totalPages ? ` / ${totalPages}` : ''} trang
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {isFetchingNextPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Auto-loading indicator */}
        {isAutoLoading && hasNextPage && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">
              Đang tự động tải trang {pagesLoaded + 1}/{autoLoadPages}...
            </p>
          </div>
        )}

        {/* End of results message */}
        {hasStartedLoading && !hasNextPage && !isFetchingNextPage && (
          <div className="text-center py-8 text-muted-foreground">
            <p>🎉 Bạn đã xem hết tất cả tin đăng!</p>
            <p className="text-sm mt-1">Tổng cộng đã tải {pagesLoaded} trang</p>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-8 text-red-500">
            <p>Có lỗi xảy ra khi tải thêm tin đăng. Vui lòng thử lại.</p>
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
