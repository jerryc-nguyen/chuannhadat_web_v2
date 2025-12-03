import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/types';
import { Metadata } from 'next';
import ProfileDetail from '@frontend/ProfileDetail';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { resolvePathAndQueryFromProps } from '@common/urlHelper';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2, countSearchResultsApiV2 } from '@frontend/features/search/api/searchApi';
import { QueryKeys } from '@common/QueryKeys';

type Props = {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { path, hasQueryString } = await resolvePathAndQueryFromProps(
    params as Promise<{ slug: string | string[] }>,
    searchParams,
    'profile'
  );
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default async function ProfileDetailPage({ params, searchParams }: Props) {
  const { pathWithQuery, slugStr } = await resolvePathAndQueryFromProps(
    params as Promise<{ slug: string | string[] }>,
    searchParams,
    'profile'
  );

  const perPage = 9; // keep consistent with useProfileDetail

  // Derive initial filter state from URL for profile scope
  const { filterState } = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'profile' });
  const friendly = buildFriendlyParams(filterState as any);

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
    queryKey: QueryKeys.profilePosts(APIFilterParams, slugStr, 1),
    queryFn: () => searchApiV2(APIFilterParams),
  });

  // Prefetch preview count used by FilterChips (desktop)
  const counterFilterParams = { ...friendly, author_slug: slugStr };
  await queryClient.prefetchQuery({
    queryKey: QueryKeys.searchCount(counterFilterParams),
    queryFn: () => countSearchResultsApiV2(counterFilterParams),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileDetail params={params} initialFilterState={filterState as any} />
    </HydrationBoundary>
  );
}
