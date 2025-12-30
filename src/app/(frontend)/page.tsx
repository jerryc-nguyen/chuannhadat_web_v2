import CategoryPage from '@frontend/CategoryPage';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getInitialFilterStateFromUrl } from '@frontend/features/search/hooks/syncParamsToState.server';
import { buildFriendlyParams } from '@frontend/features/search/filters-v2/helpers/friendlyParamsHelper';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { buildQueryString } from '@common/urlHelper';
import { PER_PAGE_DESKTOP, PER_PAGE_MOBILE } from '@frontend/CategoryPage/constants';
import { QueryKeys } from '@common/QueryKeys';

export { metadata } from '@frontend/Home/DefaultSeo';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const sp = (await searchParams) ?? {};
  const qs = buildQueryString(sp);
  const pathWithQuery = qs ? `/?${qs}` : `/`;

  const { isMobile } = await getUserAgentInfo();
  const perPage = isMobile ? PER_PAGE_MOBILE : PER_PAGE_DESKTOP;

  const { filterState } = await getInitialFilterStateFromUrl({ pathWithQuery, scope: 'category' });
  const friendly = buildFriendlyParams(filterState as any);
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
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoryPage pathWithQuery={pathWithQuery} initialFilterState={filterState} />
    </HydrationBoundary>
  );
}
