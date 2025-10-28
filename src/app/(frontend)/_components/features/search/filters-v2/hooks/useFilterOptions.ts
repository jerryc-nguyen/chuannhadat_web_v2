import { useMemo } from 'react';
import { OptionForSelect, FilterFieldName } from '@common/types';
import { ALL_OPTION, SORT_OPTIONS } from '@common/constants';
import {
  businessTypesOptions,
  categoryTypesOptions,
  roomsOptions,
  directionsOptions,
  sellPricesOptions,
  areasOptions
} from '@app/(frontend)/_components/features/search/filter-conditions/constants';

/**
 * Hook to manage filter options for v2 filters
 * 
 * This hook is responsible for:
 * - Providing static filter options (learned from old flow constants)
 * - Managing dynamic options (projects, locations, etc.)
 * - Centralizing option loading logic
 * 
 * Separated from the fat useFilterState hook to follow single responsibility principle
 */

// Static options are now imported from the constants file

export interface FilterFieldOptions {
  businessTypeOptions: OptionForSelect[];
  categoryTypeOptions: OptionForSelect[];
  bedOptions: OptionForSelect[];
  bathOptions: OptionForSelect[];
  roomOptions: OptionForSelect[];
  directionOptions: OptionForSelect[];
  priceOptions: OptionForSelect[];
  areaOptions: OptionForSelect[];
  sortOptions: OptionForSelect[];
}

export interface UseFilterOptionsProps {
  /** Dynamic options that can be passed from parent components */
  dynamicOptions?: {
    projects?: OptionForSelect[];
    cities?: OptionForSelect[];
    districts?: OptionForSelect[];
    wards?: OptionForSelect[];
    busCatTypes?: OptionForSelect[];
  };
}

export default function useFilterOptions({ dynamicOptions = {} }: UseFilterOptionsProps = {}) {
  // Memoize static options to prevent unnecessary re-renders
  const filterFieldOptions = useMemo<FilterFieldOptions>(() => ({
    businessTypeOptions: businessTypesOptions,
    categoryTypeOptions: [ALL_OPTION, ...categoryTypesOptions],
    bedOptions: [ALL_OPTION, ...roomsOptions],
    bathOptions: [ALL_OPTION, ...roomsOptions],
    roomOptions: [ALL_OPTION, ...roomsOptions],
    directionOptions: [ALL_OPTION, ...directionsOptions],
    priceOptions: [ALL_OPTION, ...sellPricesOptions],
    areaOptions: [ALL_OPTION, ...areasOptions.map(option => ({
      ...option,
      range: option.range ? {
        min: option.range.min === null ? undefined : option.range.min,
        max: option.range.max
      } : undefined
    }))],
    sortOptions: SORT_OPTIONS,
  }), []);

  // Helper function to get options for a specific filter field
  const getOptionsForField = (fieldName: FilterFieldName): OptionForSelect[] => {
    switch (fieldName) {
      case FilterFieldName.BusinessType:
        return filterFieldOptions.businessTypeOptions;
      
      case FilterFieldName.CategoryType:
        return filterFieldOptions.categoryTypeOptions;
      
      case FilterFieldName.Bed:
        return filterFieldOptions.bedOptions;
      
      case FilterFieldName.Bath:
        return filterFieldOptions.bathOptions;
      
      case FilterFieldName.Rooms:
        return filterFieldOptions.roomOptions;
      
      case FilterFieldName.Direction:
        return filterFieldOptions.directionOptions;
      
      case FilterFieldName.Price:
        return filterFieldOptions.priceOptions;
      
      case FilterFieldName.Area:
        return filterFieldOptions.areaOptions;
      
      case FilterFieldName.Sort:
        return filterFieldOptions.sortOptions;
      
      // Dynamic options
      case FilterFieldName.Project:
      case FilterFieldName.AggProjects:
        return dynamicOptions.projects || [];
      
      case FilterFieldName.City:
        return dynamicOptions.cities || [];
      
      case FilterFieldName.District:
        return dynamicOptions.districts || [];
      
      case FilterFieldName.Ward:
        return dynamicOptions.wards || [];
      
      case FilterFieldName.BusCatType:
        return dynamicOptions.busCatTypes || [];
      
      default:
        return [];
    }
  };

  return {
    /** All static filter field options */
    filterFieldOptions,
    
    /** Get options for a specific filter field */
    getOptionsForField,
    
    /** Dynamic options passed from parent */
    dynamicOptions,
    
    /** Check if options are available for a field */
    hasOptionsForField: (fieldName: FilterFieldName) => {
      return getOptionsForField(fieldName).length > 0;
    },
  };
}