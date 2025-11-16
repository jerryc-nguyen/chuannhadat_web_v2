import React from 'react';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/types';
import { useQuery } from '@tanstack/react-query';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { buildFriendlyParams } from '../helpers/friendlyParamsHelper';
import { useFilterStatePresenter } from './useFilterStatePresenter';
import { useFilterState } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterState';

export interface UseFilterOperationProps {
  onFiltersChanged?: (filterState: FilterState) => void;
  setIsOpenPopover?: (open: boolean) => void;
  counterFetcher?: (params: Record<string, string>) => Promise<Record<string, A>>;
}

export const useFilterOperation = ({
  onFiltersChanged,
  setIsOpenPopover,
  counterFetcher = searchApiV2,
}: UseFilterOperationProps = {}) => {
  const { filterState: selectedFilterState, clearFilter, updateFilters } = useFilterState();
  // Local filter state management
  const [localFilterState, setLocalFilterState] = React.useState<FilterState>({});

  // Filter state presenter
  const { selectedFilterText, isActiveChip } = useFilterStatePresenter(selectedFilterState);

  // Build filter params for API call
  const currentFilterState = React.useMemo(() => {
    // Only merge if localFilterState has actual values
    if (Object.keys(localFilterState).length === 0) {
      return selectedFilterState;
    }
    return { ...selectedFilterState, ...localFilterState };
  }, [selectedFilterState, localFilterState]);

  const filterParams = React.useMemo(() => {
    return buildFriendlyParams(currentFilterState);
  }, [currentFilterState]);

  // API query
  const { data, isLoading: isPreviewLoading } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => counterFetcher?.(filterParams),
  });

  // Extract preview count from current data
  const previewCount = data?.pagination?.total_count || 0;

  // Handle local filter changes within the dropdown
  const handleLocalFilterChange = React.useCallback((fieldName: FilterFieldName, value: OptionForSelect | undefined) => {
    setLocalFilterState((prev: FilterState) => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  // Handle local location changes within the dropdown
  const handleLocalLocationChange = React.useCallback((location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => {
    setLocalFilterState((prev: FilterState) => ({
      ...prev,
      ...location
    }));
  }, []);

  // Apply filter with composite filter logic
  const onApplyFilter = React.useCallback((filterChipItem: FilterChipOption) => {
    // Close popover if setter is provided
    if (setIsOpenPopover) {
      setIsOpenPopover(false);
    }

    const fieldName = filterChipItem.id as FilterFieldName;
    let newFilters: FilterState = {}
    if (fieldName === FilterFieldName.Locations || fieldName === FilterFieldName.ProfileLocations) {
      // For location filters, apply all location-related values
      newFilters = updateFilters({
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      });
    } else if (fieldName === FilterFieldName.Rooms) {
      // For room filters, apply all room-related values
      newFilters = updateFilters({
        bed: localFilterState.bed,
        bath: localFilterState.bath,
      });
    } else if (fieldName === FilterFieldName.BusCatType) {
      // BusCatType clears location data (following old applySingleFilter logic)
      newFilters = updateFilters({
        busCatType: localFilterState.busCatType,
        city: undefined,
        district: undefined,
        ward: undefined,
      });
    } else if (fieldName === FilterFieldName.AggProjects) {
      // AggProjects sets both aggProjects and project, clears location data
      newFilters = updateFilters({
        aggProjects: localFilterState.aggProjects,
        project: localFilterState.aggProjects,
        city: undefined,
        district: undefined,
        ward: undefined,
      });
    } else {
      // For simple filters, just set the field value
      newFilters = updateFilters({
        [fieldName]: localFilterState[fieldName]
      });
    }

    // Notify parent component of filter changes
    if (typeof onFiltersChanged === 'function') {
      onFiltersChanged(newFilters);
    }
  }, [localFilterState, updateFilters, onFiltersChanged, setIsOpenPopover]);

  // Handle filter removal
  // will be removed!
  const handleRemoveFilter = React.useCallback((filterOption: FilterChipOption) => {
    const fieldName = filterOption.id as FilterFieldName;
    let newFilters: FilterState = {}
    if (fieldName === FilterFieldName.Locations || fieldName === FilterFieldName.ProfileLocations) {
      // For location filters, apply all location-related values
      newFilters = updateFilters({
        city: undefined,
        district: undefined,
        ward: undefined,
      });
    } else if (fieldName === FilterFieldName.Rooms) {
      // For room filters, apply all room-related values
      newFilters = updateFilters({
        bed: undefined,
        bath: undefined,
      });
    } else if (fieldName === FilterFieldName.BusCatType) {
      // BusCatType clears location data (following old applySingleFilter logic)
      newFilters = updateFilters({
        busCatType: undefined,
        city: undefined,
        district: undefined,
        ward: undefined,
      });
    } else if (fieldName === FilterFieldName.AggProjects) {
      // AggProjects sets both aggProjects and project, clears location data
      newFilters = updateFilters({
        aggProjects: undefined,
        project: undefined,
      });
    } else {
      // For simple filters, just set the field value
      newFilters = updateFilters({
        [fieldName]: undefined
      });
    }

    // Notify parent component of filter changes
    if (typeof onFiltersChanged === 'function') {
      onFiltersChanged(newFilters);
    }
  }, [onFiltersChanged, updateFilters]);

  return {
    // Filter state management
    selectedFilterState,
    localFilterState,
    setLocalFilterState,
    currentFilterState,

    // Filter state presenter
    selectedFilterText,
    isActiveChip,

    // API data
    data,
    isPreviewLoading,

    // Preview data
    previewCount,

    // Filter operations
    handleLocalFilterChange,
    handleLocalLocationChange,
    onApplyFilter,
    handleRemoveFilter,
    clearFilter
  };
};
