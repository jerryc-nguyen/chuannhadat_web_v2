'use client';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { ChevronLeft, ChevronRight, EllipsisIcon } from 'lucide-react';
import ReactPaginate from 'react-paginate';

interface PostPaginationProps {
  total_pages: number;
  onPageChange?(selectedItem: { selected: number }): void;
  currentPage: number;
}

export function PostPagination({ total_pages, onPageChange, currentPage }: PostPaginationProps) {
  return (
    <ReactPaginate
      className="mb-10 mt-4 flex justify-center gap-1"
      breakLabel={
        <div className="flex h-full items-center justify-center">
          <EllipsisIcon className="h-4 w-4" />
        </div>
      }
      nextLabel={
        <div className="flex h-full items-center justify-center">
          <Button variant="outline" className="h-8 min-w-8 p-1">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      }
      onPageChange={onPageChange}
      forcePage={currentPage ? currentPage -1 : 0}
      pageLabelBuilder={(page) => {
        return (
          <Button variant="outline" className="h-8 min-w-8 p-0 px-1">
            {page}
          </Button>
        );
      }}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      pageCount={total_pages}
      pageLinkClassName={cn('text-bold h-full flex justify-center items-center p-1')}
      activeLinkClassName={cn('text-blue-500')}
      disabledLinkClassName="opacity-25"
      previousLabel={
        <div className="flex h-full items-center justify-center">
          <Button variant="outline" className="h-8 min-w-8 p-1">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      }
      renderOnZeroPageCount={() => <div>No more data</div>}
    />
  );
}
