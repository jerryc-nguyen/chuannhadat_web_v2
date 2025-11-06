import React from 'react';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/types';
import { FilterChangeEvent } from '../types/pure-ui-types';
import { useQuery } from '@tanstack/react-query';
import { searchApiV2 } from '@frontend/features/search/api/searchApi';
import { buildFriendlyParams } from '../helpers/friendlyParamsHelper';
import { useFilterStatePresenter } from './useFilterStatePresenter';

export interface UseFilterOperationProps {
  selectedFilterState: FilterState;
  onFieldChanged: (event: FilterChangeEvent) => void;
  onFiltersChanged?: (filterState: FilterState) => void;
  setIsOpenPopover?: (open: boolean) => void;
}

export const useFilterOperation = ({
  selectedFilterState,
  onFieldChanged,
  onFiltersChanged,
  setIsOpenPopover,
}: UseFilterOperationProps) => {

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
    queryFn: () => searchApiV2(filterParams),
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

    // Handle multiple values for composite filters using the new event params structure
    // This mirrors the old applySingleFilter logic for handling composite filters
    if (fieldName === FilterFieldName.Locations || fieldName === FilterFieldName.ProfileLocations) {
      // For location filters, apply all location-related values
      onFieldChanged({
        fieldName,
        value: localFilterState[fieldName],
        params: {
          city: localFilterState.city,
          district: localFilterState.district,
          ward: localFilterState.ward,
        }
      });
    } else if (fieldName === FilterFieldName.Rooms) {
      // For room filters, apply all room-related values
      onFieldChanged({
        fieldName,
        value: localFilterState[fieldName],
        params: {
          bed: localFilterState.bed,
          bath: localFilterState.bath,
        }
      });
    } else if (fieldName === FilterFieldName.BusCatType) {
      // BusCatType clears location data (following old applySingleFilter logic)
      onFieldChanged({
        fieldName,
        value: localFilterState[fieldName],
        params: {
          busCatType: localFilterState.busCatType,
          city: undefined,
          district: undefined,
          ward: undefined,
        }
      });
    } else if (fieldName === FilterFieldName.AggProjects) {
      // AggProjects sets both aggProjects and project, clears location data
      onFieldChanged({
        fieldName,
        value: localFilterState[fieldName],
        params: {
          aggProjects: localFilterState.aggProjects,
          project: localFilterState.aggProjects,
          city: undefined,
          district: undefined,
          ward: undefined,
        }
      });
    } else {
      // For simple filters, just set the field value
      onFieldChanged({
        fieldName,
        value: localFilterState[fieldName]
      });
    }

    // Notify parent component of filter changes
    if (typeof onFiltersChanged === 'function') {
      const currentFilterState = { ...selectedFilterState, ...localFilterState };
      onFiltersChanged(currentFilterState);
    }
  }, [
    localFilterState,
    selectedFilterState,
    onFieldChanged,
    onFiltersChanged,
    setIsOpenPopover
  ]);

  // Handle filter removal
  const handleRemoveFilter = React.useCallback((filterOption: FilterChipOption) => {
    const fieldName = filterOption.id as FilterFieldName;

    if (typeof onFiltersChanged === 'function') {
      // Convert FilterState to the expected format after clearing
      const newFilterState = { ...selectedFilterState };
      if (fieldName === FilterFieldName.Locations || fieldName === FilterFieldName.ProfileLocations) {
        delete newFilterState['city'];
        delete newFilterState['district'];
        delete newFilterState['ward'];
      } else if (fieldName === FilterFieldName.Rooms) {
        delete newFilterState['bed'];
        delete newFilterState['bath'];
      } else if (fieldName === FilterFieldName.BusCatType) {
        delete newFilterState['busCatType'];
      } else if (fieldName === FilterFieldName.AggProjects) {
        delete newFilterState['aggProjects'];
        delete newFilterState['project'];
      } else {
        delete newFilterState[fieldName];
      }
      onFiltersChanged(newFilterState);
    }
  }, [selectedFilterState, onFiltersChanged]);

  return {
    // Filter state management
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
  };
};
