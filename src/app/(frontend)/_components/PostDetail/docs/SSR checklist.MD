# SSR Checklist and Boilerplate (Next.js App Router + React Query)

This document provides a reusable checklist and boilerplate for implementing SSR with React Query in any App Router page. It covers prerequisites, server-side prefetch, hydration, error handling, and tuning for a smooth first render.

## SSR Checklist
- Providers
  - Ensure a global `QueryClientProvider` is mounted (e.g., via a `QueryProvider` in your app’s root layout or provider wrapper).
  - If using additional state (e.g., Jotai), ensure its providers are also present in the client tree.
- Route Component
  - Use a server component for the route page (App Router default is server).
  - If you need device-specific behavior, use a server-side detector like `getUserAgentInfo()`.
- Parameters
  - Validate and parse route `params` and `searchParams`.
  - If your project defines `Params` as a `Promise<...>` (as in this repo), await it before destructuring.
  - Guard against invalid or missing params; consider `notFound()` for invalid routes.
- Prefetch Data (Server)
  - Create a per-request `new QueryClient()`.
  - Prefetch queries with stable, consistent query keys.
  - Optional: compute initial state from URL and convert to API params.
- Hydration
  - Call `dehydrate(queryClient)` to serialize the server cache.
  - Wrap the rendered client subtree with `HydrationBoundary` using the dehydrated state.
- Client Hooks
  - Ensure client hooks use the exact same query keys as prefetch to benefit from hydration.
  - Tune `staleTime` and `refetchOnMount` to avoid immediate refetch if not desired.
- Error Handling
  - Wrap `prefetchQuery` in `try/catch` to handle upstream API errors gracefully.
  - Decide on fallback UI or error boundary behavior for failures.
- Performance & Tuning
  - Set a small `staleTime` (e.g., 5–10s) for first paint to reduce double fetch.
  - Avoid serializing huge caches; prefetch only the data needed for initial render.

## Boilerplate Template

```tsx
// Example: Generic SSR route page with server prefetch and hydration
// Adjust imports for your project structure
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
// import { myApi } from '...';
// import { queryKeys } from '...';
// import MyClientPage from './MyClientPage';

// Optional search params type (Next.js provides this in the page signature)
type SearchParams = Record<string, string | string[] | undefined>;

function buildQueryString(searchParams: SearchParams = {}) {
  const usp = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach(v => usp.append(key, String(v)));
    else if (value !== undefined) usp.append(key, String(value));
  });
  return usp.toString();
}

// Server component (App Router page)
export default async function Page({ params, searchParams }: { params?: any; searchParams?: SearchParams }) {
  // 1) Parse params and search params safely
  const slug = params?.slug as string[] | string | undefined;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = slugStr ? `/${slugStr}` : '/';
  const qs = buildQueryString(searchParams);
  const pathWithQuery = qs ? `${path}?${qs}` : path;

  // 2) Optional: device detection
  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? 4 : 9; // example density tuning

  // 3) Optional: derive initial state from URL and convert to API params
  // const initialState = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'your-scope' });
  // const apiParams = buildYourApiParams(initialState);
  const apiParams = { page: 1, per_page: perPage }; // replace with your params

  // 4) Prefetch on server
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ['your-query-key', apiParams],
      queryFn: () => /* myApi.fetchSomething(apiParams) */ Promise.resolve({ data: [] }),
    });
    // Prefetch more queries if needed
    // await queryClient.prefetchQuery({ queryKey: ['other-key', id], queryFn: () => myApi.fetchOther(id) });
  } catch (err) {
    // Optional: log or set fallback state; don’t let SSR crash
  }

  // 5) Dehydrate and wrap hydration boundary
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* Pass any props needed for client components (e.g., initialState) */}
      {/* Ensure client hooks use the same query keys as prefetch */}
      {/* <MyClientPage initialState={initialState} /> */}
      <div>Replace with your client component tree</div>
    </HydrationBoundary>
  );
}
```

## Usage Notes
- Replace placeholder API calls and query keys with your actual modules.
- Keep query keys consistent across server and client; consider exporting key factories.
- If your route `params` type is asynchronous (e.g., `Promise<{ slug: string[] }>`), await it before use.
- Consider extracting a shared helper to build API params from URL-derived state to reduce duplication.

## Optional: Query Key Helpers
```ts
// src/common/queryKeys.ts
export const listKey = (params: unknown) => ['list', params] as const;
export const detailKey = (id: string) => ['detail', id] as const;
```

Use these in both server prefetch and client hooks.

## Optional: Stale Time Strategy
- First paint optimization: set `staleTime` > 0 for queries used at first render to avoid a refetch immediately after hydration.
- Example client hook:
```ts
useQuery({ queryKey: listKey(apiParams), queryFn: () => myApi.fetchList(apiParams), staleTime: 5_000 });
```

## Optional: Error Boundaries
- Wrap your client components with an error boundary for better UX when hydrated queries fail on the client.

## Final Checklist (Quick)
- Global `QueryClientProvider` present.
- Server component parses and validates `params`/`searchParams`.
- `QueryClient` created per request.
- Queries prefetched with stable keys; `try/catch` for errors.
- `dehydrate(queryClient)` and wrap with `HydrationBoundary`.
- Client hooks use identical query keys.
- Tune `staleTime` to reduce double fetch; avoid massive cache payloads.