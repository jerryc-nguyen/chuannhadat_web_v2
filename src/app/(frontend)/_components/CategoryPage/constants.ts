import { SORT_CHIP_OPTION, FilterChipOption } from "@common/types";
import { FilterFieldName } from "@common/types";

// Shared per-page constants for Category pages
export const PER_PAGE_DESKTOP = 9;
export const PER_PAGE_MOBILE = 4;

export const listFilterDesktop: Array<FilterChipOption> = [
  {
    id: FilterFieldName.BusinessType,
    text: 'Loại tin',
  },
  {
    id: FilterFieldName.CategoryType,
    text: 'Loại nhà đất',
  },
  { id: FilterFieldName.Project, text: 'Dự án' },
  {
    id: FilterFieldName.Price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.Area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.Rooms,
    text: 'Số Phòng',
  },
  {
    id: FilterFieldName.Direction,
    text: 'Hướng',
  },
  SORT_CHIP_OPTION
];

export const listFilterProfileDesktop: Array<FilterChipOption> = [
  {
    id: FilterFieldName.BusCatType,
    text: 'Phân loại',
  },
  { id: FilterFieldName.ProfileLocations, text: 'Khu vực' },
  { id: FilterFieldName.AggProjects, text: 'Dự án' },
  {
    id: FilterFieldName.Price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.Area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.Rooms,
    text: 'Số Phòng',
  },
  {
    id: FilterFieldName.Direction,
    text: 'Hướng',
  },
  SORT_CHIP_OPTION
];

export const listFilterProfileMobile: Array<FilterChipOption> = [
  {
    id: FilterFieldName.BusCatType,
    text: 'Phân loại',
  },
  { id: FilterFieldName.ProfileLocations, text: 'Khu vực' },
  { id: FilterFieldName.AggProjects, text: 'Dự án' },
  {
    id: FilterFieldName.Price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.Area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.Rooms,
    text: 'Số Phòng',
  },
  {
    id: FilterFieldName.Direction,
    text: 'Hướng',
  }
];

export const listFilterMobile: FilterChipOption[] = [
  // {
  //   id: FilterFieldName.FilterOverview,
  //   text: 'Bộ Lọc',
  // },
  {
    id: FilterFieldName.BusinessType,
    text: 'Loại tin',
  },
  {
    id: FilterFieldName.CategoryType,
    text: 'Loại nhà đất',
  },
  { id: FilterFieldName.Project, text: 'Dự án' },
  {
    id: FilterFieldName.Price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.Area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.Rooms,
    text: 'Số Phòng',
  },
  {
    id: FilterFieldName.Direction,
    text: 'Hướng',
  },
];
