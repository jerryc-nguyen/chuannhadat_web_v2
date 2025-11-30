# Category Page: Server URL Hydration + React Query SSR Prefetch

This document explains the two approaches we considered for Category pages:

- Server-only URL → state hydration using `getInitialFilterStateFromUrl` and client atom hydration.
- React Query server-side prefetch with `QueryClient.prefetchQuery` and `<HydrationBoundary />`, as used in `PostDetail`.

It also provides a recommended combined approach and example snippets.

## Goals

- Hydrate filter state from the URL on the server (avoid client waterfall).
- Render initial results fast by having data available at first paint.
- Keep hooks order stable and avoid conditional calls.

## Current Implementation (Server-only hydration)

- On the server, we call `getInitialFilterStateFromUrl({ pathWithQuery, scope: 'category' })`.
- We pass `initialFilterState` and `currentContentType` to the client components.
- In client, `useHydrateFilterStates({ filterState, currentContentType })` hydrates Jotai atoms.
- `useCategoryPageController` derives `APIFilterParams` from the hydrated atoms and fetches posts via `useQueryPostsV2` on the client.

Pros:

- Simple and avoids client-only URL sync.
- No double-call to `toParamsApi`.

Cons:

- Initial posts data is fetched on the client, which can delay first render data.

## PostDetail Pattern (React Query SSR)

- On the server, create a `QueryClient` and prefetch necessary queries.
- Call `dehydrate(queryClient)` and wrap the client tree in `<HydrationBoundary state={dehydratedState} />`.
- Client components use React Query hooks and read cached data instantly.

Pros:

- Faster initial render; data is ready at first paint.
- Consistent with existing pages like `PostDetail` and `ProfileDetail`.

Cons:

- Slightly more boilerplate on route pages.

## Recommended Combined Approach

Keep server-only URL → state hydration and add SSR prefetch for the main posts list. This delivers fast initial UX and keeps state consistent.

### Steps per route page

1. Build `pathWithQuery` from `params` and `searchParams`.
2. Call `getInitialFilterStateFromUrl({ pathWithQuery, scope: 'category' })`.
3. Build `APIFilterParams` from `initialFilterState` using `buildFriendlyParams(filterState)` and add:
   - `with_title: true`, `with_users: true`,
   - `page` and `per_page`.
4. Prefetch with `QueryClient.prefetchQuery` using `searchApiV2(APIFilterParams)`.
5. Dehydrate and wrap `<CategoryPage />` with `<HydrationBoundary />`.

### Example: building `pathWithQuery`

```ts
type SearchParams = Record<string, string | string[] | undefined>;

function buildQueryString(searchParams: SearchParams = {}) {
  const usp = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, String(v)));
    } else if (value !== undefined) {
      usp.append(key, String(value));
    }
  });
  return usp.toString();
}

// Usage in route: const pathWithQuery = qs ? `${path}?${qs}` : path;
```

### Example: SSR prefetch pattern for Category routes

```tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import CategoryPage from '@frontend/CategoryPage';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';

export default async function Page({ params, searchParams }: { params: { slug: string | string[] }, searchParams?: Record<string, string | string[] | undefined> }) {
  const slug = params.slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/category/${slugStr}`; // adjust per route

  // Build query string and pathWithQuery
  const qs = (() => {
    const usp = new URLSearchParams();
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((v) => usp.append(key, String(v)));
      else if (value !== undefined) usp.append(key, String(value));
    });
    return usp.toString();
  })();
  const pathWithQuery = qs ? `${path}?${qs}` : path;

  // Derive initial state on server
  const initialFilterState = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'category' });

  // Build API params
  const friendly = buildFriendlyParams(initialFilterState as any);
  const APIFilterParams = {
    ...friendly,
    with_title: true,
    with_users: true,
    page: 1,
    per_page: 9,
  };

  // Prefetch results
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['useQueryPostsV2', APIFilterParams],
    queryFn: () => searchApiV2(APIFilterParams),
  });
  const dehydratedState = dehydrate(queryClient);

  // Render
  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} />
    </HydrationBoundary>
  );
}
```

### Client-side controller stays unchanged

- `useCategoryPageController` keeps using `useHydrateFilterStates` and `useQueryPostsV2`.
- With SSR prefetch, `useQueryPostsV2` reads from the hydrated cache and avoids an extra initial fetch.

## Hook Order and Safety Notes

- `useHydrateFilterStates` is called unconditionally; it performs a no-op when `filterState` is not provided, preserving hook order.
- `useSearchAggs` is called unconditionally in the controller; aggregation data usage remains conditional.
- We removed `useSyncParamsToState` from client components to ensure URL→state hydration is server-only.

## Testing Checklist

- Navigate to `/`, `/[...slug]`, and `/category/[...slug]` with and without query strings.
- Verify filter chips reflect hydrated state and initial results render without client-side delay.
- Confirm React Query devtools (if enabled) show hydrated cache for `['useQueryPostsV2', APIFilterParams]`.

## Migration Notes

- For any other pages still calling `useSyncParamsToState`, migrate them to the server hydration + SSR prefetch pattern described above.