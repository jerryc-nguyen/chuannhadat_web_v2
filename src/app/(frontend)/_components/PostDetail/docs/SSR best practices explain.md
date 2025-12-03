# PostDetail SSR: Best Practices and Implementation Guide

This document explains how the PostDetail server component implements SSR with React Query, why it’s beneficial, and how to do it correctly. It also highlights common pitfalls and improvements for production-grade behavior.

## Why SSR for Post Detail
- Faster first paint: Prefetched data is embedded into HTML, so the client can render immediately without waiting for network.
- Better UX: Reduces initial loading spinners and layout shifts.
- Consistent data layer: Aligns with the hydration pattern used elsewhere (e.g., Category pages, other SSR components).

## Key Building Blocks
- `QueryClient` (server): A per-request cache used to prefetch data before rendering.
- `prefetchQuery`: Executes the fetch on the server and stores results in the server `QueryClient`.
- `dehydrate`: Serializes the server cache into a form the client can rehydrate.
- `HydrationBoundary` (server → client bridge): Wraps the rendered subtree, passing the dehydrated cache to the client.
- `QueryClientProvider` (client): Must be present in your app providers; it supplies the client-side `QueryClient` for hooks to read the hydrated cache. Your `provider-wrapper.tsx` already includes a `QueryProvider`.
- Device detection (`getUserAgentInfo`): Used server-side to choose mobile or desktop UI.

## Current Implementation (Reviewed)

```tsx
// File: src/app/(frontend)/_components/PostDetail/index.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { postsApi } from './api/posts';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@common/types';
import PostDetailDesktop from './PostDetailDesktop';
import PostDetailMobile from './PostDetailMobile';

interface PostDetailProps {
  params: Params; // In this codebase: Promise<{ slug: string[] }>
}

export default async function PostDetail({ params }: PostDetailProps) {
  const { slug } = await params; // await is required due to the local Params type
  const rawSlug = Array.isArray(slug) ? slug[0] : slug;
  const productUid = typeof rawSlug === 'string' ? rawSlug.split('-').slice(-1)[0] : '';
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();

  // Prefetch api in server only when we have a valid uid
  if (productUid) {
    await queryClient.prefetchQuery({
      queryKey: ['get-detail-post', productUid],
      queryFn: () => postsApi.getDetailPost(productUid),
    });
    await queryClient.prefetchQuery({
      queryKey: ['get-posts-same-author', productUid],
      queryFn: () => postsApi.getPostsSameAuthor(productUid),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile productUid={productUid} isModal={false} />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
```

### Is it correct?
- Yes. This follows React Query SSR best practices: prefetch on server, dehydrate, hydrate on client, and render immediately.
- One local nuance: `Params` is defined as a `Promise<{ slug: string[] }>` in `src/common/types/search.ts`. Awaiting `params` is required to satisfy TypeScript in this codebase.

## Best Practices and Improvements

**1) Stabilize Query Keys**
- Define query key factories and reuse them in both server prefetch and client hooks.
- Example:
```ts
// src/common/queryKeys.ts
export const postDetailKey = (uid: string) => ['get-detail-post', uid] as const;
export const sameAuthorKey = (uid: string) => ['get-posts-same-author', uid] as const;
```
- Use them consistently to prevent accidental mismatches.

**2) Guard Slug Parsing and Handle Invalid Input**
- Ensure slug exists and has the expected format. If invalid, render a controlled fallback.
- Optionally use Next’s `notFound()` from `next/navigation` for invalid routes.

**3) Error Handling During Prefetch**
- Wrap `prefetchQuery` calls in `try/catch`. If an API fails, decide whether to show an error boundary, fallback UI, or partial data.
- Example:
```tsx
try {
  await queryClient.prefetchQuery({ queryKey: postDetailKey(productUid), queryFn: () => postsApi.getDetailPost(productUid) });
} catch (e) {
  // log or handle gracefully
}
```

**4) Stale Time Tuning to Avoid Double Fetch**
- If client hooks set `staleTime: 0`, hydrated data is immediately stale and may refetch once on mount.
- Consider a small `staleTime` (e.g., 5–10 seconds) on client hooks for these queries to reduce immediate refetch after hydration.

**5) Device-Specific Rendering**
- You already use `getUserAgentInfo()` to select mobile vs desktop. Keep this server-side for accurate first render.
- Consider passing `productUid` to desktop as well for clarity if it uses hooks that require it.

**6) Provider Presence**
- Ensure `QueryClientProvider` is mounted globally (your `provider-wrapper.tsx` does this with `QueryProvider`). Without it, hydration will not work.

## Enhanced Example with Guards and Keys

```tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { postDetailKey, sameAuthorKey } from '@common/queryKeys';
import { postsApi } from './api/posts';
import type { Params } from '@common/types';
import PostDetailDesktop from './PostDetailDesktop';
import PostDetailMobile from './PostDetailMobile';

interface PostDetailProps { params: Params }

export default async function PostDetail({ params }: PostDetailProps) {
  const { slug } = await params;
  const rawSlug = Array.isArray(slug) ? slug[0] : slug;
  const productUid = typeof rawSlug === 'string' ? rawSlug.split('-').slice(-1)[0] : '';

  const { isMobile } = await getUserAgentInfo();
  const queryClient = new QueryClient();

  if (productUid) {
    try {
      await queryClient.prefetchQuery({ queryKey: postDetailKey(productUid), queryFn: () => postsApi.getDetailPost(productUid) });
      await queryClient.prefetchQuery({ queryKey: sameAuthorKey(productUid), queryFn: () => postsApi.getPostsSameAuthor(productUid) });
    } catch (err) {
      // Optional: log or set a fallback state
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <div className="c-mobileApp">
          <PostDetailMobile productUid={productUid} isModal={false} />
        </div>
      ) : (
        <PostDetailDesktop />
      )}
    </HydrationBoundary>
  );
}
```

## Common Pitfalls
- Mismatched query keys between server prefetch and client hooks → hydration does nothing.
- Missing `QueryClientProvider` → client hooks don’t see hydrated cache.
- Overly aggressive refetch on mount due to `staleTime: 0` and Suspense.
- Unhandled invalid slug → prefetch with empty or wrong `uid`.

## Checklist
- Server component creates `QueryClient`, prefetches, and calls `dehydrate`.
- Wrap client render with `HydrationBoundary`.
- Client has `QueryClientProvider` via global providers.
- Query keys identical on server and client.
- Slug parsing robust; consider `notFound()` on invalid routes.
- Consider `staleTime` tuning to reduce double-fetch.

## References
- TanStack Query SSR docs: HydrationBoundary, dehydrate, prefetchQuery.
- Next.js App Router server components and route params.
- Your app’s `provider-wrapper.tsx` for global providers.