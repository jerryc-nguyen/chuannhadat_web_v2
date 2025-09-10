import { useMemo } from 'react';
import { FilterChipOption } from '@frontend/CategoryPage/mobile/filter_bds/types';
import { FilterFieldName } from '@models';
import useFilterState from '@frontend/CategoryPage/mobile/filter_bds/hooks/useFilterState';

/**
 * Custom hook to handle chip UI logic and filtering
 * Manages which chips should be displayed based on current filter state
 */
export const useFilterChipsUI = (chipOptions: FilterChipOption[]) => {
  const { filterState } = useFilterState();

  const filteredChipOptions = useMemo(() => {
    const selectedCategoryType = filterState.categoryType?.value as string;

    // Category types that should hide the Project chip
    const categoryTypesWithoutProjects = [
      'nha_rieng',           // Nhà riêng
      'nha_mat_pho',         // Nhà mặt phố
      'trang_trai_khu_nghi_duong', // Trang trại
      'nha_tro_phong_tro',   // Nhà trọ
      'van_phong',           // Văn phòng
      'cua_hang_kiot',       // Cửa hàng kiôt
      'bat_dong_san_khac',   // Khác
    ];

    // Category types that should hide the Rooms chip
    const categoryTypesWithoutRooms = [
      'dat',                 // Đất
    ];

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
