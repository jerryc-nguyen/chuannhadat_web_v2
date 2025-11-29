'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';

type Props = {
  table: Table<any>;
  className?: string;
  position?: string;
  showTotal?: boolean;
  resourceName?: string;
};

const DEFAULT_PAGE_SIZE = 10;

const PaginationMobile: React.FC<Props> = ({
  table,
  className,
  showTotal = true,
  resourceName = 'bản ghi',
}) => {
  const pageCountRaw = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const meta: any = (table.options as any)?.meta ?? {};
  const totalCount: number | undefined = typeof meta.totalCount === 'number' ? meta.totalCount : undefined;
  const pageSize = table.getState().pagination.pageSize || DEFAULT_PAGE_SIZE;
  const pageCount = pageCountRaw || (typeof totalCount === 'number' ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1);

  const hasTotal = typeof totalCount === 'number';
  const startItem = hasTotal ? Math.min(totalCount as number, pageIndex * pageSize + 1) : pageIndex * pageSize + 1;
  const endItem = hasTotal ? Math.min(totalCount as number, (pageIndex + 1) * pageSize) : (pageIndex + 1) * pageSize;

  const getPageItems = (current: number, total: number): (number | '…')[] => {
    // Mobile: keep tighter range
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, '…', total];
    }
    if (current >= total - 2) {
      return [1, '…', total - 2, total - 1, total];
    }
    return [1, '…', current, '…', total];
  };

  const goToPage = (n: number) => {
    const clamped = Math.max(1, Math.min(pageCount, n));
    table.setPageIndex(clamped - 1);
  };

  const baseClasses = 'border-t border-gray-200 bg-white px-3 py-2 flex flex-col gap-2 shadow-md';
  const wrapperClass = `${className ?? ''} ${baseClasses}`;
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={wrapperClass}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-2 text-gray-700">
        {showTotal && hasTotal && (
          <span className="text-gray-500">
            {startItem} - {endItem} của {totalCount} {resourceName}
          </span>
        )}
        ·
        <span className="text-gray-500">
          Trang {pageIndex + 1}/{pageCount}
        </span>
      </div>
      <div className="flex items-center gap-2 justify-between pb-3">
        <div className="flex items-center gap-1 whitespace-nowrap overflow-x-auto -mx-2 px-2">
          {getPageItems(pageIndex + 1, pageCount).map((item, idx) =>
            item === '…' ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-xs text-gray-500">…</span>
            ) : (
              <button
                key={`page-${item}`}
                aria-label={`Đi tới trang ${item}`}
                className={`h-8 min-w-[2rem] rounded-md border text-sm ${item === pageIndex + 1 ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900'}`}
                onClick={() => goToPage(item as number)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            className="h-8 px-3 rounded-md border text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </button>
          <button
            className="h-8 px-3 rounded-md border text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationMobile;
