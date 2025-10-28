import { useMemo } from 'react';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { FilterState } from '../../filter-conditions/types';
import { useFilterLocations } from '@frontend/features/navigation/mobile-locations/hooks';
import { buildFriendlyParams } from '../helpers/friendlyParamsHelper';
import useSearchScope, { SearchScopeEnums } from '@app/(frontend)/_components/features/search/hooks/useSearchScope';
import { searchApiV2 } from '@app/(frontend)/_components/features/search/api/searchApi';

/**
 * Presenter hook that provides common UI text and state checking functions
 * for filter chips. This hook can be reused by both old and new useFilterState implementations.
 * 
 * Follows the MVP (Model-View-Presenter) pattern where this hook acts as the presentation layer
 * that formats raw filter state data for UI consumption.
 */
export function useFilterStatePresenter(filterState: FilterState) {
  const { selectedLocationText } = useFilterLocations();
  const { searchScope } = useSearchScope();

  /**
   * Gets the display text for a filter chip based on current filter state
   */
  const selectedFilterText = useMemo(() => {
    return (filterOption: FilterChipOption): string => {
      const fieldName = filterOption.id;

      if (filterOption.id === FilterFieldName.Locations ||
        filterOption.id === FilterFieldName.ProfileLocations) {
        return selectedLocationText ?? 'Khu vực';
      } else if (filterOption.id === FilterFieldName.AggProjects ||
        filterOption.id === FilterFieldName.Project) {
        return filterState.project?.text ?? 'Dự án';
      } else if (filterOption.id === FilterFieldName.Rooms) {
        const roomText = selectedRoomText();
        return roomText || 'Số phòng';
      } else {
        return (
          //@ts-ignore: read value
          filterState[fieldName]?.text ?? filterOption.text
        );
      }
    };
  }, [filterState, selectedLocationText]);

  /**
   * Gets the display text for room filters (bed/bath combination)
   */
  const selectedRoomText = useMemo(() => {
    return (): string => {
      const results = [];
      if (filterState.bed) {
        results.push(`${filterState.bed.text} PN`);
      }
      if (filterState.bath) {
        results.push(`${filterState.bath.text} WC`);
      }
      return results.join(' / ');
    };
  }, [filterState.bed, filterState.bath]);

  /**
   * Checks if a filter chip should be displayed as active
   */
  const isActiveChip = useMemo(() => {
    return (filterOption: FilterChipOption): boolean => {
      const fieldName = filterOption.id;

      if (
        filterOption.id === FilterFieldName.Locations ||
        filterOption.id === FilterFieldName.ProfileLocations
      ) {
        return !!(filterState.city || filterState.district || filterState.ward);
      } else if (filterOption.id === FilterFieldName.Rooms) {
        return !!(filterState.bed || filterState.bath);
      } else if (filterOption.id === FilterFieldName.AggProjects) {
        return !!(filterState.aggProjects || filterState.project);
      } else {
        return (
          //@ts-ignore: read value
          !!filterState[fieldName]?.text
        );
      }
    };
  }, [filterState]);

  /**
   * Builds user-friendly query parameters based on current filter state
   * Returns an object with Vietnamese parameter names for URL display
   */
  const friendlyParams = useMemo(() => {
    return buildFriendlyParams(filterState);
  }, [filterState]);

  const syncSelectedParamsToUrl = async (filterParams: Record<string, A>) => {
    // disable auto sync state to url for manage post page
    if (searchScope !== SearchScopeEnums.Category) {
      return;
    }

    let queryOptions = buildFriendlyParams(filterParams);
    queryOptions = {
      ...queryOptions,
      only_url: 'true',
    };
    const response = await searchApiV2(queryOptions);
    const { listing_url } = response;
    window.history.pushState({}, '', listing_url);
  };

  return {
    selectedFilterText,
    selectedRoomText,
    isActiveChip,
    buildFriendlyParams,
    friendlyParams,
    syncSelectedParamsToUrl
  };
}
