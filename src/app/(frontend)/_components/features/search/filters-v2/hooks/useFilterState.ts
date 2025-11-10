import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { FilterFieldName, OptionForSelect } from '@common/types';
import {
  filterStateAtom,
  filterFieldOptionsAtom,
  emptyFilterState,
} from '../../filters-v2/states';
import { FilterState } from '../../types';
import { useSyncFilterParamsToUrl } from './useSyncFilterParamsToUrl';
import { buildFriendlyParams } from '@app/(frontend)/_components/features/search/filters-v2/helpers/friendlyParamsHelper';

/**
 * State manager hook that provides a clean interface between pure UI components and global state
 * This hook encapsulates all the complex state management logic and provides simple callbacks
 * for UI components to use.
 */
export function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const filterFieldOptions = useAtomValue(filterFieldOptionsAtom);
  const { syncCategoryParamsToUrl } = useSyncFilterParamsToUrl();

  // Memoized derived state
  const hasActiveFilters = useMemo(() => {
    return Object.values(filterState).some(value =>
      value && value.value !== 'all' && value.value !== undefined
    );
  }, [filterState]);

  // Event handlers for pure UI components
  const updateFilters = useCallback((updateValues: Partial<FilterState>) => {
    setFilterState(prev => ({
      ...prev,
      ...updateValues,
    }));

    const newFilterState = { ...filterState, ...updateValues }
    const queryParams = buildFriendlyParams(newFilterState);
    syncCategoryParamsToUrl(queryParams);
    return newFilterState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState]);

  const handleLocationChange = useCallback((location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => {
    setFilterState(prev => ({
      ...prev,
      city: location.city,
      district: location.district,
      ward: location.ward,
    }));
  }, [setFilterState]);

  const handleRoomChange = useCallback((rooms: {
    bed?: OptionForSelect;
    bath?: OptionForSelect;
  }) => {
    setFilterState(prev => ({
      ...prev,
      bed: rooms.bed,
      bath: rooms.bath,
    }));
  }, [setFilterState]);

  const clearFilter = useCallback((fieldName: FilterFieldName) => {
    // Handle special cases for composite filters
    const newFilterState: FilterState = { ...filterState };

    switch (fieldName) {
      case FilterFieldName.Locations:
      case FilterFieldName.ProfileLocations:
        newFilterState.city = undefined;
        newFilterState.district = undefined;
        newFilterState.ward = undefined;
        break;
      case FilterFieldName.Rooms:
        newFilterState.bed = undefined;
        newFilterState.bath = undefined;
        break;
      case FilterFieldName.AggProjects:
        newFilterState.aggProjects = undefined;
        newFilterState.project = undefined;
        newFilterState.city = undefined;
        newFilterState.district = undefined;
        newFilterState.ward = undefined;
        break;
      case FilterFieldName.BusCatType:
        newFilterState.busCatType = undefined;
        newFilterState.businessType = undefined;
        newFilterState.categoryType = undefined;
        break;
      default:
        (newFilterState as any)[fieldName] = undefined;
    }

    setFilterState(newFilterState);
    const queryParams = buildFriendlyParams(newFilterState);
    syncCategoryParamsToUrl(queryParams);
    return newFilterState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState]);

  const handleClearAllFilters = useCallback(() => {
    setFilterState(emptyFilterState);
  }, [setFilterState]);

  const getFilterValue = useCallback((fieldName: FilterFieldName) => {
    return filterState[fieldName];
  }, [filterState]);

  return {
    // State
    filterState,
    filterFieldOptions,
    hasActiveFilters,

    // Event handlers for pure UI components
    updateFilters,
    onLocationChange: handleLocationChange,
    onRoomChange: handleRoomChange,
    clearFilter,
    onClearAllFilters: handleClearAllFilters,

    // Utility functions
    getFilterValue
  };
}
