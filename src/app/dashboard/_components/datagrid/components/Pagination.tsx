'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';

type Props = {
  table: Table<any>;
  className?: string;
  // Simplified to the current working solution only
  position?: 'fixed-fit';
  showTotal?: boolean;
  resourceName?: string;
};
const DEFAULT_PAGE_SIZE = 10;

const Pagination: React.FC<Props> = ({ table, className, position = 'fixed-fit', showTotal = true, resourceName = 'bản ghi' }) => {
  const pageCountRaw = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const [pageInput, setPageInput] = React.useState<number>(pageIndex + 1);

  React.useEffect(() => {
    setPageInput(pageIndex + 1);
  }, [pageIndex]);

  const meta: any = (table.options as any)?.meta ?? {};
  const totalCount: number | undefined = typeof meta.totalCount === 'number' ? meta.totalCount : undefined;
  const pageSize = table.getState().pagination.pageSize || DEFAULT_PAGE_SIZE;
  const pageCount = pageCountRaw || (typeof totalCount === 'number' ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1);

  const hasTotal = typeof totalCount === 'number';
  const startItem = hasTotal ? Math.min(totalCount as number, pageIndex * pageSize + 1) : pageIndex * pageSize + 1;
  const endItem = hasTotal ? Math.min(totalCount as number, (pageIndex + 1) * pageSize) : (pageIndex + 1) * pageSize;

  const getPageItems = (current: number, total: number): (number | '…')[] => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '…', total];
    }
    if (current >= total - 3) {
      return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '…', current - 1, current, current + 1, '…', total];
  };

  const goToPage = (n: number) => {
    const clamped = Math.max(1, Math.min(pageCount, n));
    table.setPageIndex(clamped - 1);
  };

  const baseClasses = 'border border-gray-200 bg-white px-3 py-2 flex items-center justify-between';
  const wrapperClass = `${className ?? ''} ${baseClasses}`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [fixedStyle, setFixedStyle] = React.useState<React.CSSProperties | undefined>(undefined);

  const updateFixedStyle = React.useCallback(() => {
    const el = containerRef.current;
    const parent = el?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    setFixedStyle({ position: 'fixed', bottom: 0, left: rect.left, width: rect.width, zIndex: 20 });
  }, [position]);

  React.useEffect(() => {
    const onResize = () => updateFixedStyle();
    const onScroll = () => updateFixedStyle();

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    setTimeout(() => updateFixedStyle(), 100);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [position, updateFixedStyle]);
  // Always use fixed-fit logic

  return (
    <div ref={containerRef} className={wrapperClass} style={fixedStyle}>
      <div className="flex items-center gap-3 text-sm text-gray-700">
        {showTotal && hasTotal && (
          <span className="text-gray-500">
            {startItem} - {endItem} của {totalCount} {resourceName}
          </span>
        )}
        ·
        <span className="text-gray-500">
          Trang {pageIndex + 1} / {pageCount}
        </span>

      </div >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {getPageItems(pageIndex + 1, pageCount).map((item, idx) =>
            item === '…' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-500">…</span>
            ) : (
              <button
                key={`page-${item}`}
                className={`w-8 h-8 rounded border px-2 py-1 text-sm ${item === pageIndex + 1 ? 'bg-gray-900 text-white border-gray-900' : ''}`}
                onClick={() => goToPage(item as number)}
              >
                {item}
              </button>
            )
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>Đi tới trang</span>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={pageInput}
            onChange={(e) => setPageInput(Number(e.target.value) || 1)}
            onBlur={() => goToPage(pageInput)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                goToPage(pageInput);
              }
            }}
            className="w-16 rounded border px-2 py-1 text-sm"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trang trước
          </button>
          <button
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div >
  );
};

export default Pagination;
