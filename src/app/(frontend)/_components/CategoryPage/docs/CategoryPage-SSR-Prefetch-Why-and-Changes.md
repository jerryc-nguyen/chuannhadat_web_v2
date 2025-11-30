# Category Page: SSR Prefetch + URL Hydration — Why and What Changed

This document explains why the Category routes were updated to perform server-side data prefetch with React Query and how this complements the existing server URL → state hydration. It also compares the previous behavior, outlines limitations, and shows the advantages after the change. Code snippets of the exact edits are included below.

## Context and Goals

- Preserve the simple URL → filter state hydration pattern already used by Category pages.
- Improve first render by prefetching the main list query on the server and hydrating it on the client.
- Align Category pages with the established SSR pattern (`prefetchQuery` + `dehydrate` + `HydrationBoundary`) used in `PostDetail`.

## Before: Limitations

- Client-only list fetch: The posts list (`useQueryPostsV2`) was fetched on the client after mount, causing an initial empty state and potential layout shifts.
- No SSR cache for list: React Query had no dehydrated cache for the first paint, so even with Suspense, the client had to wait for the network.
- Duplicate URL parsing risk: Route pages assembled `pathWithQuery`, and `CategoryPage` re-parsed the URL to construct `initialFilterState` itself.
- Device-specific page size not applied on server: `per_page` was determined only within client components, not consistently during SSR.
- Less consistent with app patterns: Other parts (e.g., `PostDetail`) already leverage server prefetch and hydration to deliver faster initial UX.

## After: Advantages

- Server prefetch and hydration: The routes now create a `QueryClient`, prefetch the first page via `searchApiV2`, and wrap the client tree in `HydrationBoundary` with a dehydrated cache. The client starts with data ready.
- Single source of truth for URL → state: Route pages compute `initialFilterState` once and pass it down; `CategoryPage` uses it directly or falls back to server parsing if missing.
- Faster initial render, fewer flickers: Hydrated data avoids the empty list flicker and reduces layout shifts.
- Device-aware `per_page` at SSR: We pick `per_page` based on `getUserAgentInfo()` server-side (mobile: 4, desktop: 9) so the prefetched payload matches the intended UI density.
- Consistent pattern: Matches the SSR hydration approach used in `PostDetail`, making the app’s data layer more uniform.

### Caveat and tuning

- `useQueryPostsV2` sets `staleTime: 0` and `gcTime: 0`, which means the prefetched data is immediately stale and may refetch once on mount under Suspense. To fully avoid a second fetch, consider:
  - Increasing `staleTime` for the first page (e.g., `staleTime: 5_000`), or
  - Disabling `refetchOnMount` for this query when hydrated.
  - Keeping the current behavior is acceptable; the immediate refetch ensures freshness.

## Changes Summary

1. `CategoryPage` accepts `initialFilterState` and uses it directly when provided; otherwise it falls back to parsing `pathWithQuery` on the server.
2. Three route files (`/(frontend)/page.tsx`, `/(frontend)/[...slug]/page.tsx`, and `/(frontend)/category/[...slug]/page.tsx`) now:
   - Build `pathWithQuery` from `params` and `searchParams`.
   - Compute `initialFilterState` via `getInitialFilterStateFromUrl`.
   - Build `APIFilterParams` using `buildFriendlyParams(initialFilterState)` and device-aware `per_page`.
   - Prefetch the list data on the server, `dehydrate` the cache, and wrap the render with `HydrationBoundary`.

## Code Changes

### 1) `CategoryPage` now accepts `initialFilterState`

```tsx
// File: src/app/(frontend)/_components/CategoryPage/index.tsx
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import CategoryDesktopV2 from './CategoryDesktopV2';
import CategoryMobileV2 from './CategoryMobileV2';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { POSTS_TYPE_OPTION } from '@frontend/features/navigation/main-content-navigator/constants';

interface CategoryPageProps {
  isMobile?: boolean;
  pathWithQuery?: string;
  initialFilterState?: Record<string, any>;
}

export default async function CategoryPage({
  isMobile,
  pathWithQuery,
  initialFilterState,
}: CategoryPageProps) {
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();
  const path = pathWithQuery || '/';
  const serverInitialState =
    initialFilterState ??
    (await getInitialFilterStateFromUrl({ pathWithQuery: path, scope: 'category' }));

  return userAgent.isMobile ? (
    <CategoryMobileV2
      initialFilterState={serverInitialState}
      currentContentType={POSTS_TYPE_OPTION}
    />
  ) : (
    <CategoryDesktopV2
      initialFilterState={serverInitialState}
      currentContentType={POSTS_TYPE_OPTION}
    />
  );
}
```

### 2) Root Category route prefetch and hydration

```tsx
// File: src/app/(frontend)/page.tsx
import CategoryPage from '@frontend/CategoryPage';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { getUserAgentInfo } from '@common/getUserAgentInfo';

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

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const qs = buildQueryString(searchParams);
  const pathWithQuery = qs ? `/?${qs}` : `/`;

  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? 4 : 9;

  const initialFilterState = await getInitialFilterStateFromUrl({
    pathWithQuery,
    scope: 'category',
  });
  const friendly = buildFriendlyParams(initialFilterState as any);
  const APIFilterParams = {
    ...friendly,
    with_title: true,
    with_users: true,
    page: 1,
    per_page: perPage,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['useQueryPostsV2', APIFilterParams],
    queryFn: () => searchApiV2(APIFilterParams),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} initialFilterState={initialFilterState} />
    </HydrationBoundary>
  );
}
```

### 3) Dynamic slug route prefetch and hydration

```tsx
// File: src/app/(frontend)/[...slug]/page.tsx
import CategoryPage from '@frontend/CategoryPage';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { getUserAgentInfo } from '@common/getUserAgentInfo';

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

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string | string[] };
  searchParams?: SearchParams;
}) {
  const slug = params.slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/${slugStr}`;
  const qs = buildQueryString(searchParams);
  const pathWithQuery = qs ? `${path}?${qs}` : path;

  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? 4 : 9;

  const initialFilterState = await getInitialFilterStateFromUrl({
    pathWithQuery,
    scope: 'category',
  });
  const friendly = buildFriendlyParams(initialFilterState as any);
  const APIFilterParams = {
    ...friendly,
    with_title: true,
    with_users: true,
    page: 1,
    per_page: perPage,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['useQueryPostsV2', APIFilterParams],
    queryFn: () => searchApiV2(APIFilterParams),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} initialFilterState={initialFilterState} />
    </HydrationBoundary>
  );
}
```

### 4) Category slug route prefetch and hydration

```tsx
// File: src/app/(frontend)/category/[...slug]/page.tsx
import CategoryPage from '@frontend/CategoryPage';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { getUserAgentInfo } from '@common/getUserAgentInfo';

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

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string | string[] };
  searchParams?: SearchParams;
}) {
  const slug = params.slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/category/${slugStr}`;
  const qs = buildQueryString(searchParams);
  const pathWithQuery = qs ? `${path}?${qs}` : path;

  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? 4 : 9;

  const initialFilterState = await getInitialFilterStateFromUrl({
    pathWithQuery,
    scope: 'category',
  });
  const friendly = buildFriendlyParams(initialFilterState as any);
  const APIFilterParams = {
    ...friendly,
    with_title: true,
    with_users: true,
    page: 1,
    per_page: perPage,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['useQueryPostsV2', APIFilterParams],
    queryFn: () => searchApiV2(APIFilterParams),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} initialFilterState={initialFilterState} />
    </HydrationBoundary>
  );
}
```

## Suggested Follow-ups (Optional)

- Extract a shared server helper to build `APIFilterParams` from `initialFilterState` to reduce duplication across routes.
- Consider a small `staleTime` for the first page to avoid refetch-over-suspense when hydrated.
- Keep the query key stable and consistent (`['useQueryPostsV2', APIFilterParams]`) across server/client to maximize cache hits.
