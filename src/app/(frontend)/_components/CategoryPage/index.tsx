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

export default async function CategoryPage({ isMobile, pathWithQuery, initialFilterState }: CategoryPageProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  // Derive initial filter state from the URL on the server
  // Fallback to root path if not provided
  const path = pathWithQuery || '/';
  const result = await getInitialFilterStateFromUrl({ pathWithQuery: path, scope: 'category' });
  const serverInitialState = initialFilterState ?? result.filterState;

  return userAgent.isMobile
    ? (
      <CategoryMobileV2
        initialFilterState={serverInitialState}
        currentContentType={POSTS_TYPE_OPTION}
      />
    )
    : (
      <CategoryDesktopV2
        initialFilterState={serverInitialState}
        currentContentType={POSTS_TYPE_OPTION}
      />
    );
}
