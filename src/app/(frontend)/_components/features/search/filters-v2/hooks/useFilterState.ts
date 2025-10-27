import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import { FilterFieldName, OptionForSelect } from '@common/types';
import {
  filterStateAtom,
  filterFieldOptionsAtom,
} from '../../filter-conditions/states';
import { FilterState } from '../../filter-conditions/types';
import { FilterChangeEvent, FilterApplyEvent, FilterClearEvent } from '../types/pure-ui-types';

/**
 * State manager hook that provides a clean interface between pure UI components and global state
 * This hook encapsulates all the complex state management logic and provides simple callbacks
 * for UI components to use.
 */
export function useFilterState() {
  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const filterFieldOptions = useAtomValue(filterFieldOptionsAtom);

  // Memoized derived state
  const hasActiveFilters = useMemo(() => {
    return Object.values(filterState).some(value =>
      value && value.value !== 'all' && value.value !== undefined
    );
  }, [filterState]);

  // Event handlers for pure UI components
  const handleFilterChange = useCallback((event: FilterChangeEvent) => {
    const { fieldName, value } = event;

    setFilterState(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }, [setFilterState]);

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

  const handleApplyFilters = useCallback((changedFields?: FilterFieldName[]) => {
    // Emit apply event for parent components
    const event: FilterApplyEvent = {
      filterState: filterState,
      changedFields: changedFields || [],
    };

    return event;
  }, [filterState]);

  const handleClearFilter = useCallback((fieldName: FilterFieldName) => {
    const previousValue = filterState[fieldName];

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
      default:
        (newFilterState as any)[fieldName] = undefined;
    }

    setFilterState(newFilterState);

    // Emit clear event
    const event: FilterClearEvent = {
      fieldName,
      previousValue,
    };

    return event;
  }, [filterState, setFilterState]);

  const handleClearAllFilters = useCallback(() => {
    const emptyState: FilterState = {
      businessType: undefined,
      categoryType: undefined,
      bed: undefined,
      bath: undefined,
      price: { text: 'Tất cả', value: 'all' },
      area: { text: 'Tất cả', value: 'all' },
      direction: undefined,
      city: undefined,
      district: undefined,
      ward: undefined,
      project: undefined,
      sort: undefined,
      busCatType: undefined,
    };

    setFilterState(emptyState);
  }, [setFilterState]);

  // Helper functions for UI components
  const getFilterValue = useCallback((fieldName: FilterFieldName) => {
    return filterState[fieldName];
  }, [filterState]);

  const isFilterActive = useCallback((fieldName: FilterFieldName) => {
    const value = filterState[fieldName];

    switch (fieldName) {
      case FilterFieldName.Locations:
      case FilterFieldName.ProfileLocations:
        return !!(filterState.city || filterState.district || filterState.ward);
      case FilterFieldName.Rooms:
        return !!(filterState.bed || filterState.bath);
      case FilterFieldName.AggProjects:
        return !!(filterState.aggProjects || filterState.project);
      default:
        return !!(value && value.value !== 'all' && value.value !== undefined);
    }
  }, [filterState]);

  return {
    // State
    filterState,
    filterFieldOptions,
    hasActiveFilters,

    // Event handlers for pure UI components
    onFilterChange: handleFilterChange,
    onLocationChange: handleLocationChange,
    onRoomChange: handleRoomChange,
    onApplyFilters: handleApplyFilters,
    onClearFilter: handleClearFilter,
    onClearAllFilters: handleClearAllFilters,

    // Utility functions
    getFilterValue,
    isFilterActive,
  };
}
