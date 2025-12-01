import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import { Metadata } from 'next';
import CategoryPage from '@frontend/CategoryPage';
import { PER_PAGE_MOBILE, PER_PAGE_DESKTOP } from '@frontend/CategoryPage/constants';
import { resolvePathAndQueryFromProps } from '@common/urlHelper';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2, countSearchResultsApiV2 } from '@frontend/features/search/api/searchApi';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { QueryKeys } from '@common/QueryKeys';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { path, hasQueryString } = await resolvePathAndQueryFromProps(params, searchParams);
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.SEARCH_METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string | string[] }>, searchParams?: Promise<SearchParams> }) {
  const { pathWithQuery } = await resolvePathAndQueryFromProps(params, searchParams);

  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP;

  const initialFilterState = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'category' });
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
    queryKey: QueryKeys.categoryPosts(APIFilterParams),
    queryFn: () => searchApiV2(APIFilterParams),
  });
  // Prefetch preview count used by Header/FilterChips to avoid client refetch
  const counterFilterParams = {
    ...friendly,
  };
  await queryClient.prefetchQuery({
    queryKey: QueryKeys.searchCount(counterFilterParams),
    queryFn: () => countSearchResultsApiV2(counterFilterParams),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} initialFilterState={initialFilterState} />
    </HydrationBoundary>
  );
}
