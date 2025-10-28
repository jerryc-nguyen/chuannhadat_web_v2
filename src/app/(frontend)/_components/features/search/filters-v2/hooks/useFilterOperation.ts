import React from 'react';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/filter-conditions/types';
import { FilterChangeEvent } from '../types/pure-ui-types';

export interface UseFilterOperationProps {
  localFilterState: FilterState;
  setLocalFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedFilterState: FilterState;
  onFieldChanged: (event: FilterChangeEvent) => void;
  onClearFilter: (filterFieldName: FilterFieldName) => void;
  onFiltersChanged?: (filterState: FilterState) => void;
  setIsOpenPopover?: (open: boolean) => void;
}

export const useFilterOperation = ({
  localFilterState,
  setLocalFilterState,
  selectedFilterState,
  onFieldChanged,
  onClearFilter,
  onFiltersChanged,
  setIsOpenPopover,
}: UseFilterOperationProps) => {

  // Handle local filter changes within the dropdown
  const handleLocalFilterChange = React.useCallback((fieldName: FilterFieldName, value: OptionForSelect | undefined) => {
    setLocalFilterState(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, [setLocalFilterState]);

  // Handle local location changes within the dropdown
  const handleLocalLocationChange = React.useCallback((location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => {
    setLocalFilterState(prev => ({
      ...prev,
      ...location
    }));
  }, [setLocalFilterState]);

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
    onClearFilter(fieldName);

    if (typeof onFiltersChanged === 'function') {
      // Convert FilterState to the expected format after clearing
      const newFilterState = { ...selectedFilterState };
      delete newFilterState[fieldName];

      const convertedState: Record<string, OptionForSelect> = {};
      Object.entries(newFilterState).forEach(([key, value]) => {
        if (value) {
          convertedState[key] = value;
        }
      });
      onFiltersChanged(convertedState);
    }
  }, [selectedFilterState, onClearFilter, onFiltersChanged]);

  return {
    handleLocalFilterChange,
    handleLocalLocationChange,
    onApplyFilter,
    handleRemoveFilter,
  };
};
