# URL↔State Sync Patterns (Pagination, Filters, Sorting)

This guide documents a robust pattern for synchronizing UI state with URL query parameters and vice versa, with a focus on pagination (`page`, `per_page`). It also applies to filters and sorting.

## Overview

- Goal: Let users edit the URL directly (e.g., `?page=3&per_page=50`) and have the table state update accordingly, while ensuring UI interactions (buttons/inputs) update the URL without flicker or loops.
- Challenge: Avoid races and infinite loops between URL changes and component state updates.

## Common Use Cases

- Pagination: `page` (1-based), `per_page` (page size).
- Filters: e.g., `q`, `status`, `date_range` — reflect filter state in the URL to enable sharing and back/forward navigation.
- Sorting: e.g., `sort` and `order` (or `id`/`desc`) to keep sort configuration in the URL.

## Common Issues

- UI click vs URL change race: Clicking a page button updates local state; a URL-sync effect running at the wrong time can “snap back” to the previous page.
- Infinite loops: URL-sync pushes a new route; a state-sync reads it and writes back, causing repeated updates or flicker.
- Defaults and omission: Omitting default params (e.g., hiding `page=1`) can incorrectly reset state if the effect interprets “missing” as “reset now”.
- Removing keys in query strings: `lodash.merge` ignores `undefined`; use `null` to override existing keys, then remove them with a `removeEmpty` step.

## Standard Solution

- Single source of truth: Treat the URL as the authoritative source for state when it changes; otherwise, respect local interactions.
- React only to real URL changes:
  - Track the last processed search string with a ref.
  - Skip processing if the search string hasn’t changed.
- Keep effect dependencies minimal:
  - Depend on `searchParams` and static defaults.
  - Avoid depending on current local pagination/sorting/filter state in the URL→state effect.
- Handle param presence explicitly:
  - If a param exists, derive the next value from it.
  - If a param is absent, decide whether to keep current state or apply a default (for pagination, `page` default is 1 and `per_page` default is the controller’s `pageSize`).
- Omit defaults from the URL cleanly:
  - Set `page` to `null` when page is 1 to remove it from the URL.
  - Optionally set `per_page` to `null` when it equals the default page size.

## Reference Implementation (Pagination)

Hook to sync URL→state safely:

```ts
'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

type PaginationState = { pageIndex: number; pageSize: number };
type SetPagination = (next: PaginationState) => void;

export function useSyncPaginationQueryToState(options: {
  pageSizeDefault: number;
  setPagination: SetPagination;
  setFormValue?: (name: string, value: any) => void;
}) {
  const { pageSizeDefault, setPagination, setFormValue } = options;
  const searchParams = useSearchParams();
  const prevSearchRef = useRef<string>('');

  useEffect(() => {
    const searchStr = searchParams.toString();
    if (prevSearchRef.current === searchStr) return; // Only react on actual URL changes
    prevSearchRef.current = searchStr;

    const pageRaw = searchParams.get('page');
    const perPageRaw = searchParams.get('per_page');

    const pageNum = pageRaw !== null ? Number(pageRaw) : NaN;
    const perPageNum = perPageRaw !== null ? Number(perPageRaw) : NaN;

    const nextPageIndex = Number.isFinite(pageNum) && pageNum > 0 ? pageNum - 1 : 0; // default page = 1
    const nextPageSize = Number.isFinite(perPageNum) && perPageNum > 0 ? perPageNum : pageSizeDefault;

    setPagination({ pageIndex: nextPageIndex, pageSize: nextPageSize });
    if (setFormValue) {
      try {
        setFormValue('page', nextPageIndex + 1);
        setFormValue('per_page', nextPageSize);
      } catch (_) {}
    }
  }, [searchParams, pageSizeDefault, setPagination, setFormValue]);
}
```

Controller integrating URL sync in both directions:

```ts
// Build sync object for URL
const syncObject = {
  ...submittedFilters,
  page: pagination.pageIndex + 1,
  per_page: pagination.pageSize,
};

// Remove defaults from URL cleanly
if (syncObject.page === 1) syncObject.page = null; // lodash.merge respects null
// Optional: if (syncObject.per_page === defaultPageSize) syncObject.per_page = null;

useSyncQueryToUrl(syncObject, EXCLUDE_FIELDS_TO_URL);
```

## Testing Checklist

- Click pagination buttons (including next/prev) → table updates, URL updates, no “snap back”.
- Manually edit URL (`?page=5&per_page=50`) → table reflects the change instantly.
- Navigate to page 1 → `page` is omitted in URL and the table stays on page 1.
- Use back/forward browser navigation → table state follows URL history with no flicker.

## Notes

- For filters and sorting, apply the same pattern: only react to URL changes, treat absent params as defaults or keep current state as appropriate, and omit defaults by writing `null` so they’re removed in the final query string.
- Ensure your URL builder merges existing query with updates and removes empty values; when clearing keys, pass `null` not `undefined`.