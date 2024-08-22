export type Range = {
  min?: number;
  max?: number;
};

export type OptionForSelect = {
  value: number | string;
  text: string;
  range?: Range;
  params?: Record<string, A>;
};

export const PARAM_BUSINESS_TYPE = 'business_type';
export const PARAM_CATEGORY_TYPE = 'category_type';
export const PARAM_PRICE = 'price';
export const PARAM_ARE = 'area';
export const PARAM_BED = 'bedrooms_count';
export const PARAM_BATH = 'bathrooms_count';
export const PARAM_DIRECTION = 'direction';
export const PARAM_CITY = 'city_id';
export const PARAM_DISTRICT = 'district_id';
export const PARAM_WARD = 'ward_id';
export const PARAM_SORT = 'sort';

export enum FilterFieldName {
  none,
  filterOverview,
  businessType,
  categoryType,
  locations,
  price,
  area,
  rooms,
  bed,
  bath,
  direction,
  city,
  district,
  ward,
  sort,
}

export const FILTER_FIELDS_TO_PARAMS = [
  'businessType',
  'categoryType',
  'price',
  'area',
  'bed',
  'bath',
  'direction',
  'city',
  'district',
  'ward',
  'sort',
];

export const FILTER_FIELDS_PARAMS_MAP: Record<string, A> = {
  businessType: PARAM_BUSINESS_TYPE,
  categoryType: PARAM_CATEGORY_TYPE,
  price: PARAM_PRICE,
  area: PARAM_ARE,
  bed: PARAM_BED,
  bath: PARAM_BATH,
  direction: PARAM_DIRECTION,
  city: PARAM_CITY,
  district: PARAM_DISTRICT,
  ward: PARAM_WARD,
  sort: PARAM_SORT,
};
