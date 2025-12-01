import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/types';
import { Metadata } from 'next';
import ProfileDetail from '@frontend/ProfileDetail';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { buildQueryString } from '@common/urlHelper';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2, countSearchResultsApiV2 } from '@frontend/features/search/api/searchApi';

type Props = {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const path = `/profile/${slug}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default async function ProfileDetailPage({ params, searchParams }: Props) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/profile/${slugStr}`;
  const sp = (await searchParams) ?? {};
  const qs = buildQueryString(sp);
  const pathWithQuery = qs ? `${path}?${qs}` : path;

  const perPage = 9; // keep consistent with useProfileDetail

  // Derive initial filter state from URL for profile scope
  const initialFilterState = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'profile' });
  const friendly = buildFriendlyParams(initialFilterState as any);

  // Build API filter params for initial search
  const APIFilterParams = {
    ...friendly,
    author_slug: slugStr,
    aggs_for: 'profile',
    with_users: true,
    page: 1,
    per_page: perPage,
  };

  const queryClient = new QueryClient();

  // Prefetch profile posts for initial render
  await queryClient.prefetchQuery({
    queryKey: ['profile-post', { filterParams: APIFilterParams, profileSlug: slugStr }, 1],
    queryFn: () => searchApiV2(APIFilterParams),
  });

  // Prefetch preview count used by FilterChips (desktop)
  const counterFilterParams = { ...friendly, author_slug: slugStr };
  await queryClient.prefetchQuery({
    queryKey: ['FooterBtsButton', counterFilterParams, true, true],
    queryFn: () => countSearchResultsApiV2(counterFilterParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileDetail params={params} initialFilterState={initialFilterState as any} />
    </HydrationBoundary>
  );
}
