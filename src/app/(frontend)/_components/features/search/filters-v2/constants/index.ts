import { ALL_OPTION } from '@common/constants';
import { OptionForSelect } from '@common/types';

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
    range: { min: 800_000_000, max: 1_000_000_000 },
    text: '800 triệu - 1 tỷ',
  },
  {
    range: { min: 1_000_000_000, max: 2_000_000_000 },
    text: '1 tỷ - 2 tỷ',
  },
  {
    range: { min: 2000000000, max: 3000000000 },
    text: '2 tỷ - 3 tỷ',
  },
  {
    range: { min: 3_000_000_000, max: 4_000_000_000 },
    text: '3 tỷ - 4 tỷ',
  },
  {
    range: { min: 4000000000, max: 5000000000 },
    text: '4 tỷ - 5 tỷ',
  },
  {
    range: { min: 5_000_000_000, max: 6_000_000_000 },
    text: '5 tỷ - 6 tỷ',
  },
  {
    range: { min: 6_000_000_000, max: 7_000_000_000 },
    text: '6 tỷ - 7 tỷ',
  },
  {
    range: { min: 7_000_000_000, max: 8_000_000_000 },
    text: '7 tỷ - 8 tỷ',
  },
  {
    range: { min: 8_000_000_000, max: 10_000_000_000 },
    text: '8 tỷ - 10 tỷ',
  }
];

export const rentPricesOptions = [
  {
    range: { min: 1_000_000, max: 3_000_000 },
    text: '1 triệu - 3 triệu',
  },
  {
    range: { min: 3_000_000, max: 5_000_000 },
    text: '3 triệu - 5 triệu',
  },
  {
    range: { min: 5_000_000, max: 7_000_000 },
    text: '5 triệu - 7 triệu',
  },
  {
    range: { min: 7_000_000, max: 10_000_000 },
    text: '7 triệu - 10 triệu',
  },
  {
    range: { min: 10_000_000, max: 15_000_000 },
    text: '10 triệu - 15 triệu',
  },
  {
    range: { min: 15_000_000, max: 20_000_000 },
    text: '15 triệu - 20 triệu',
  }
];

export const areasOptions = [
  {
    range: { min: null, max: 30 },
    text: '< 30 m2',
  },
  {
    range: { min: 20, max: 40 },
    text: '20-40 m2',
  },
  {
    range: { min: 40, max: 60 },
    text: '40-60 m2',
  },
  {
    range: { min: 60, max: 80 },
    text: '60-80 m2',
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
  {
    range: { min: 150, max: 180 },
    text: '150-180 m2',
  },
  {
    range: { min: 180, max: 200 },
    text: '180-200 m2',
  }
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
