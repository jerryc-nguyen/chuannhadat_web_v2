import { useMemo } from 'react';
import { OptionForSelect, FilterFieldName } from '@common/types';
import { ALL_OPTION, SORT_OPTIONS } from '@common/constants';

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

// Static options based on old flow constants
const businessTypesOptions: OptionForSelect[] = [
  { value: 'sell', text: 'Bán' },
  { value: 'rent', text: 'Cho thuê' },
];

const categoryTypesOptions: OptionForSelect[] = [
  { value: "can_ho_chung_cu", text: "Căn hộ chung cư" },
  { value: "nha_rieng", text: "Nhà riêng" },
  { value: "nha_mat_pho", text: "Nhà mặt phố" },
  { value: "dat", text: "Đất" },
  { value: "biet_thu_lien_ke", text: "Biệt thự liền kề" },
  { value: "dat_nen_du_an", text: "Đất nền dự án" },
  { value: "trang_trai_khu_nghi_duong", text: "Trang trại/ Khu nghỉ dưỡng" },
  { value: "kho_nha_xuong", text: "Kho/ Nhà xưởng" },
  { value: "nha_tro_phong_tro", text: "Nhà trọ/ Phòng trọ" },
  { value: "van_phong", text: "Văn phòng" },
  { value: "cua_hang_kiot", text: "Cửa hàng/ Ki-ốt" },
  { value: "bat_dong_san_khac", text: "Bất động sản khác" },
];

const roomsOptions: OptionForSelect[] = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
  { value: 5, text: '5' },
  { value: 6, text: '6' },
];

const directionsOptions: OptionForSelect[] = [
  { value: 'west', text: 'Hướng Tây' },
  { value: 'west_south', text: 'Hướng Tây Nam' },
  { value: 'west_north', text: 'Hướng Tây Bắc' },
  { value: 'east', text: 'Hướng Đông' },
  { value: 'east_south', text: 'Hướng Đông Nam' },
  { value: 'east_north', text: 'Hướng Đông Bắc' },
  { value: 'south', text: 'Hướng Nam' },
  { value: 'north', text: 'Hướng Bắc' },
];

export interface FilterFieldOptions {
  businessTypeOptions: OptionForSelect[];
  categoryTypeOptions: OptionForSelect[];
  bedOptions: OptionForSelect[];
  bathOptions: OptionForSelect[];
  roomOptions: OptionForSelect[];
  directionOptions: OptionForSelect[];
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