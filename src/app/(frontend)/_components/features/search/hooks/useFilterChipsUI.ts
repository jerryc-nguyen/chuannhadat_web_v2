import { useMemo } from 'react';
import { FilterChipOption, FilterFieldName } from '@common/types';
import { useFilterState } from '@frontend/features/search/filters-v2/hooks/useFilterState';
import { categoryTypesWithoutProjects, categoryTypesWithoutRooms } from '@frontend/features/search/filters-v2/constants/policies';

/**
 * Custom hook to handle chip UI logic and filtering
 * Manages which chips should be displayed based on current filter state
 */
export const useFilterChipsUI = (chipOptions: FilterChipOption[]) => {
  const { filterState } = useFilterState();

  const filteredChipOptions = useMemo(() => {
    const selectedCategoryType = filterState.categoryType?.value as string;

    // Imported lists for category-based chip visibility

    // Filter chips based on selected category type
    return chipOptions.filter((chip) => {
      // Hide Project chip for certain category types
      if (chip.id === FilterFieldName.Project) {
        return !categoryTypesWithoutProjects.includes(selectedCategoryType);
      }

      // Hide Rooms chip for certain category types
      if (chip.id === FilterFieldName.Rooms) {
        return !categoryTypesWithoutRooms.includes(selectedCategoryType);
      }

      return true;
    });
  }, [chipOptions, filterState.categoryType?.value]);

  return {
    filteredChipOptions,
  };
};

export default useFilterChipsUI;
