import { ALL_OPTION } from '@common/constants';
import { FilterFieldName, OptionForSelect } from '@models';
import { FilterChipOption } from '../types';

export const defaultProjects: OptionForSelect[] = [
  {
    "value": 815,
    "text": "Celadon City"
  },
  {
    "value": 369,
    "text": "The Harmona"
  },
  {
    "value": 712,
    "text": "Ruby Garden"
  },
  {
    "value": 895,
    "text": "Carillon Apartment"
  },
  {
    "value": 2067,
    "text": "The Botanica"
  },
  {
    "value": 2774,
    "text": "Vinhomes Ocean Park Gia Lâm"
  },
  {
    "value": 5336,
    "text": "The Origami - Vinhomes Grand Park"
  }
]

export const businessTypesOptions: OptionForSelect[] = [
  {
    value: 'sell',
    text: 'Bán',
  },
  {
    value: 'rent',
    text: 'Cho thuê',
  },
];

export const categoryTypesOptions = [
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
]

export const roomsOptions = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
  { value: 5, text: '5' },
  { value: 6, text: '6' },
];

export const roomsOptionsForCreate: OptionForSelect[] = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
];

export const areaOptionsForCreate: OptionForSelect[] = [
  { value: 50, text: '50 m2' },
  { value: 60, text: '60 m2' },
  { value: 70, text: '70 m2' },
  { value: 80, text: '80 m2' },
];

export const facadeOptionsForCreate = [
  { value: 3, text: '3' },
  { value: 4, text: '4' },
  { value: 5, text: '5' },
  { value: 6, text: '6' },
];


export const sellPricesOptions = [
  {
    range: { min: 100000000, max: 300000000 },
    text: '100-300 triệu',
  },
  {
    range: { min: 300000000, max: 500000000 },
    text: '300-500 triệu',
  },
  {
    range: { min: 500000000, max: 800000000 },
    text: '500-800 triệu',
  },
  {
    range: { min: 800000000, max: 999000000 },
    text: '800-999 triệu',
  },
  {
    range: { min: 1000000000, max: 2000000000 },
    text: '1-2 tỷ',
  },
  {
    range: { min: 2000000000, max: 3000000000 },
    text: '2-3 tỷ',
  },
  {
    range: { min: 3000000000, max: 4000000000 },
    text: '3-4 tỷ',
  },
  {
    range: { min: 4000000000, max: 5000000000 },
    text: '4-5 tỷ',
  },
  {
    range: { min: 5000000000, max: 6000000000 },
    text: '5-6 tỷ',
  },
  {
    range: { min: 6000000000, max: 7000000000 },
    text: '6-7 tỷ',
  },
  {
    range: { min: 7000000000, max: 8000000000 },
    text: '7-8 tỷ',
  },
  {
    range: { min: 8000000000, max: 10000000000 },
    text: '8-10 tỷ',
  },
  {
    range: { min: 10000000000, max: 12000000000 },
    text: '10-12 tỷ',
  },
  {
    range: { min: 12000000000, max: 15000000000 },
    text: '12-15 tỷ',
  },
  {
    range: { min: 15000000000, max: 20000000000 },
    text: '15-20 tỷ',
  },
];
export const areasOptions = [
  {
    range: { min: null, max: 30 },
    text: '< 30 m2',
  },
  {
    range: { min: 30, max: 50 },
    text: '30-50 m2',
  },
  {
    range: { min: 50, max: 60 },
    text: '50-60 m2',
  },
  {
    range: { min: 60, max: 70 },
    text: '60-70 m2',
  },
  {
    range: { min: 70, max: 80 },
    text: '70-80 m2',
  },
  {
    range: { min: 80, max: 100 },
    text: '80-100 m2',
  },
  {
    range: { min: 100, max: 120 },
    text: '100-120 m2',
  },
  {
    range: { min: 120, max: 150 },
    text: '120-150 m2',
  },
];
export const directionsOptions = [
  { value: 'west', text: 'Hướng Tây' },
  { value: 'west_south', text: 'Hướng Tây Nam' },
  { value: 'west_north', text: 'Hướng Tây Bắc' },
  { value: 'east', text: 'Hướng Đông' },
  { value: 'east_south', text: 'Hướng Đông Nam' },
  { value: 'east_north', text: 'Hướng Đông Bắc' },
  { value: 'south', text: 'Hướng Nam' },
  { value: 'north', text: 'Hướng Bắc' },
];
export const rentPricesOptions = [
  { range: { min: 1000000, max: 3000000 }, text: '1-3 triệu' },
  { range: { min: 3000000, max: 5000000 }, text: '3-5 triệu' },
  { range: { min: 5000000, max: 7000000 }, text: '5-7 triệu' },
  { range: { min: 7000000, max: 9000000 }, text: '7-9 triệu' },
  { range: { min: 90000000, max: 11000000 }, text: '90-11 triệu' },
  { range: { min: 11000000, max: 13000000 }, text: '11-13 triệu' },
  { range: { min: 13000000, max: 15000000 }, text: '13-15 triệu' },
  { range: { min: 15000000, max: 17000000 }, text: '15-17 triệu' },
  { range: { min: 17000000, max: 20000000 }, text: '17-20 triệu' },
  { range: { min: 20000000, max: 25000000 }, text: '20-25 triệu' },
  { range: { min: 25000000, max: 30000000 }, text: '25-30 triệu' },
  { range: { min: 30000000, max: 35000000 }, text: '30-35 triệu' },
  { range: { min: 35000000, max: 40000000 }, text: '35-40 triệu' },
  { range: { min: 40000000, max: 45000000 }, text: '40-45 triệu' },
  { range: { min: 45000000, max: 50000000 }, text: '45-50 triệu' },
];
export const facadesOptions = [
  { range: { min: 3, max: 4 }, text: '3-4m' },
  { range: { min: 4, max: 4.5 }, text: '4-4.5m' },
  { range: { min: 4.5, max: 5 }, text: '4.5-5m' },
  { range: { min: 5, max: 6 }, text: '5-6m' },
  { range: { min: 6, max: 8 }, text: '6-8m' },
  { range: { min: 8, max: 10 }, text: '8-10m' },
];
export const defaultListFilterOptions = {
  businessTypeOptions: businessTypesOptions,
  categoryTypeOptions: [ALL_OPTION, ...categoryTypesOptions],
  bedOptions: [ALL_OPTION, ...roomsOptions],
  bathOptions: [ALL_OPTION, ...roomsOptions],
  priceOptions: [ALL_OPTION, ...sellPricesOptions],
  areaOptions: [ALL_OPTION, ...areasOptions],
  directionOptions: [ALL_OPTION, ...directionsOptions],
  roomOptions: [ALL_OPTION, ...roomsOptions],
};

export const SORT_CHIP_OPTION = {
  id: FilterFieldName.Sort,
  text: 'Sắp xếp',
}

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
