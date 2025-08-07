"use client";

import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';

// Dynamic import for react-paginate
const ReactPaginate = lazy(() =>
  import('react-paginate').then((mod) => ({ default: mod.default }))
);

// Loading fallback for pagination
const PaginationLoader = () => (
  <div className="flex items-center justify-center space-x-2 py-4">
    <div className="animate-pulse flex items-center space-x-2">
      {/* Previous button */}
      <div className="h-8 w-16 bg-gray-300 rounded"></div>

      {/* Page numbers */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-8 w-8 bg-gray-300 rounded"></div>
      ))}

      {/* Next button */}
      <div className="h-8 w-16 bg-gray-300 rounded"></div>
    </div>
  </div>
);

// Dynamic ReactPaginate component
export const ReactPaginateDynamic = (props: ComponentProps<typeof ReactPaginate>) => (
  <Suspense fallback={<PaginationLoader />}>
    <ReactPaginate {...props} />
  </Suspense>
);

// Styled pagination component with default classes
export const StyledPaginationDynamic = ({
  pageCount,
  onPageChange,
  currentPage = 0,
  marginPagesDisplayed = 2,
  pageRangeDisplayed = 5,
  ...props
}: {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage?: number;
  marginPagesDisplayed?: number;
  pageRangeDisplayed?: number;
}) => (
  <Suspense fallback={<PaginationLoader />}>
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={currentPage}
      marginPagesDisplayed={marginPagesDisplayed}
      pageRangeDisplayed={pageRangeDisplayed}
      containerClassName="flex items-center justify-center space-x-1"
      pageClassName="inline-flex items-center"
      pageLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-md"
      activeClassName="bg-blue-50 border-blue-500 text-blue-600"
      activeLinkClassName="bg-blue-50 border-blue-500 text-blue-600"
      previousClassName="inline-flex items-center"
      previousLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-l-md"
      nextClassName="inline-flex items-center"
      nextLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-r-md"
      breakClassName="inline-flex items-center"
      breakLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300"
      disabledClassName="opacity-50 cursor-not-allowed"
      previousLabel="Previous"
      nextLabel="Next"
      breakLabel="..."
      {...props}
    />
  </Suspense>
);

// Simple pagination with numbers only
export const SimplePaginationDynamic = ({
  pageCount,
  onPageChange,
  currentPage = 0,
  ...props
}: {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage?: number;
}) => (
  <Suspense fallback={<PaginationLoader />}>
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={currentPage}
      containerClassName="flex items-center justify-center space-x-1"
      pageClassName="inline-flex"
      pageLinkClassName="w-8 h-8 flex items-center justify-center text-sm border rounded hover:bg-gray-50"
      activeClassName="bg-blue-500 text-white border-blue-500"
      previousLabel="‹"
      nextLabel="›"
      breakLabel="…"
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      {...props}
    />
  </Suspense>
);

// Utility function to preload pagination
export const preloadPagination = () => {
  import('react-paginate');
};

// Hook for dynamic pagination usage
export const usePaginationDynamic = () => {
  return {
    preload: preloadPagination,
    ReactPaginate: ReactPaginateDynamic,
    StyledPagination: StyledPaginationDynamic,
    SimplePagination: SimplePaginationDynamic
  };
};

export default ReactPaginateDynamic;
