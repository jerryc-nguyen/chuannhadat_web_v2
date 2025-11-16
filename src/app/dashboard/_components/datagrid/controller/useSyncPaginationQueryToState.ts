'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

type PaginationState = { pageIndex: number; pageSize: number };
type SetPagination = (next: PaginationState) => void;

/**
 * Syncs pagination state with `page` and `per_page` query params.
 * - Allows users to update pagination by editing the URL directly.
 * - Mirrors URL-derived values into form state when provided.
 */
export function useSyncPaginationQueryToState(options: {
  pageSizeDefault: number;
  pagination: PaginationState;
  setPagination: SetPagination;
  setFormValue?: (name: string, value: any) => void;
}) {
  const { pageSizeDefault, pagination: _pagination, setPagination, setFormValue } = options;
  const searchParams = useSearchParams();

  const prevSearchRef = useRef<string>('');
  useEffect(() => {
    const searchStr = searchParams.toString();
    if (prevSearchRef.current === searchStr) return; // Only react to actual URL changes
    prevSearchRef.current = searchStr;

    const pageRaw = searchParams.get('page');
    const perPageRaw = searchParams.get('per_page');

    const pageNum = pageRaw !== null ? Number(pageRaw) : NaN;
    const perPageNum = perPageRaw !== null ? Number(perPageRaw) : NaN;

    // Derive from URL; when absent, use defaults
    const nextPageIndex = Number.isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0;
    const nextPageSize = Number.isFinite(perPageNum) && perPageNum > 0 ? perPageNum : pageSizeDefault;

    setPagination({ pageIndex: nextPageIndex, pageSize: nextPageSize });
    if (setFormValue) {
      try {
        setFormValue('page', nextPageIndex + 1);
        setFormValue('per_page', nextPageSize);
      } catch (_) {
        // no-op: filter type may not include these fields
      }
    }
  }, [searchParams, pageSizeDefault, setPagination, setFormValue]);
}