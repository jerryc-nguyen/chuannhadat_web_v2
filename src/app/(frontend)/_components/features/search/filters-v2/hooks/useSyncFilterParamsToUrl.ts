import { useCallback } from 'react';
import useSearchScope, { SearchScopeEnums } from '@app/(frontend)/_components/features/search/hooks/useSearchScope';
import { buildSeoListingUrl } from '@app/(frontend)/_components/features/search/api/searchApi';
import { buildUrl } from '@common/urlHelper';
import { filterFields } from '../helpers/filterFieldsHelper';

/**
 * Hook that provides functionality to sync filter parameters to URL
 * Extracts the URL synchronization logic for better separation of concerns
 */
export function useSyncFilterParamsToUrl() {
  const { searchScope } = useSearchScope();

  const forCategoryPage = async (filterParams: Record<string, any>) => {
    const response = await buildSeoListingUrl({ ...filterParams });
    const { url, path_included } = response?.data || {};
    const filteredParams = filterFields(filterParams, path_included || [])
    window.history.pushState({}, '', buildUrl(url, filteredParams));
  }
  const syncCategoryParamsToUrl = useCallback(async (filterParams: Record<string, any>) => {
    // disable auto sync state to url for manage post page
    if (searchScope === SearchScopeEnums.Category) {
      await forCategoryPage(filterParams);
    } else {
      window.history.pushState({}, '', buildUrl(window.location.pathname, filterParams));
    }
  }, [searchScope]);

  return {
    syncCategoryParamsToUrl
  };
}
