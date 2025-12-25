import React, { useCallback } from 'react';
import { FilterChipOption, OptionForSelect, FilterFieldName } from '@common/types';
import { FilterState } from '@app/(frontend)/_components/features/search/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { countSearchResultsApiV2 } from '@frontend/features/search/api/searchApi';
import { buildFriendlyParams } from '../helpers/friendlyParamsHelper';
import { useFilterStatePresenter } from './useFilterStatePresenter';
import { useFilterState } from '@app/(frontend)/_components/features/search/filters-v2/hooks/useFilterState';
import useSearchScope from '@app/(frontend)/_components/features/search/hooks/useSearchScope';
import { categoryTypesWithoutProjects } from '@frontend/features/search/filters-v2/constants/policies';
import { ITrackActionPayload, useTrackAction } from '@common/hooks';

export interface UseFilterOperationProps {
  onFiltersChanged?: (filterState: FilterState) => void;
  setIsOpenPopover?: (open: boolean) => void;
  counterFetcher?: (params: Record<string, string>) => Promise<Record<string, A>>;
  hasCountPreview?: boolean;
}

export const useFilterOperation = ({
  onFiltersChanged,
  setIsOpenPopover,
  counterFetcher = countSearchResultsApiV2,
  hasCountPreview = true,
}: UseFilterOperationProps = {}) => {
  const queryClient = useQueryClient();
  const { trackAction } = useTrackAction();
  const { defaultProfileSearchParams } = useSearchScope();
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
    return { ...buildFriendlyParams(currentFilterState), ...defaultProfileSearchParams }
  }, [currentFilterState, defaultProfileSearchParams]);

  // API query
  const { data: previewCount, isLoading: isPreviewLoading } = useQuery({
    // Include stable indicators for fetcher presence and preview toggle
    queryKey: ['FooterBtsButton', filterParams, Boolean(counterFetcher), hasCountPreview],
    queryFn: () => counterFetcher!(filterParams),
    enabled: Boolean(counterFetcher) && hasCountPreview,
  });

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

  // Internal post-apply hook to allow adjusting filters centrally
  const adjustFilters = useCallback((filterChipItem: FilterChipOption): Record<string, any> => {
    const adjusted: Record<string, any> = {};

    // When applying BusinessType, clear project fields if current category type does not support projects

    if (filterChipItem.id === 'categoryType') {
      const currentCategoryType = (currentFilterState.categoryType)?.value as string | undefined;
      if (currentCategoryType && categoryTypesWithoutProjects.includes(currentCategoryType)) {
        adjusted.project = undefined;
        adjusted.aggProjects = undefined;
      }
    }

    return adjusted;
  }, [currentFilterState]);

  const trackSubmitFilter = React.useCallback((filterChipItem: FilterChipOption) => {
    if (filterChipItem.id === FilterFieldName.Project) {
      trackAction({
        action: 'filter_by_location_picker',
        target_type: 'Core::Project',
        target_id: localFilterState.project?.value,
      } as ITrackActionPayload);
    }
  }, [localFilterState.project?.value, trackAction]);

  // Apply filter with composite filter logic
  const onApplyFilter = React.useCallback((filterChipItem: FilterChipOption) => {
    // Close popover if setter is provided
    if (setIsOpenPopover) {
      setIsOpenPopover(false);
    }

    trackSubmitFilter(filterChipItem);
    const fieldName = filterChipItem.id as FilterFieldName;
    const adjustedFilters = adjustFilters(filterChipItem);
    let updatingFields: Record<string, any> = {}
    if (fieldName === FilterFieldName.Locations || fieldName === FilterFieldName.ProfileLocations) {
      // For location filters, apply all location-related values
      updatingFields = {
        city: localFilterState.city,
        district: localFilterState.district,
        ward: localFilterState.ward,
      };
    } else if (fieldName === FilterFieldName.Rooms) {
      // For room filters, apply all room-related values
      updatingFields = {
        bed: localFilterState.bed,
        bath: localFilterState.bath,
      };
    } else if (fieldName === FilterFieldName.BusCatType) {
      // BusCatType clears location data (following old applySingleFilter logic)
      updatingFields = {
        busCatType: localFilterState.busCatType,
        city: undefined,
        district: undefined,
        ward: undefined,
      };
    } else if (fieldName === FilterFieldName.AggProjects) {
      // AggProjects sets both aggProjects and project, clears location data
      updatingFields = {
        aggProjects: localFilterState.aggProjects,
        project: localFilterState.aggProjects,
        city: undefined,
        district: undefined,
        ward: undefined,
      };
    } else {
      // For simple filters, just set the field value
      updatingFields = {
        [fieldName]: localFilterState[fieldName]
      };
    }
    // Merge adjusted filters and local filter state
    const newFilters = updateFilters({
      ...adjustedFilters,
      ...updatingFields
    });

    // Notify parent component of filter changes
    if (typeof onFiltersChanged === 'function') {
      onFiltersChanged(newFilters);
    }

    // Proactively invalidate product list queries so search runs with new filters
    // This ensures `useQueryPostsV2` refetches even if routing does not fully reload
    queryClient.invalidateQueries({ queryKey: ['useQueryPostsV2'] });
  }, [setIsOpenPopover, adjustFilters, updateFilters, onFiltersChanged, queryClient, localFilterState]);

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

    // Ensure product list refetches after filter removal
    queryClient.invalidateQueries({ queryKey: ['useQueryPostsV2'] });
  }, [onFiltersChanged, updateFilters, queryClient]);

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
