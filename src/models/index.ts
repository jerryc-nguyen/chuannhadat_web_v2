export type TPhoto = {
  id: number;
  url: string;
};
export type Params = Promise<{ slug: string[] }>;

/* eslint-disable no-unused-vars */
export type Range = {
  min?: number;
  max?: number;
};

export type OptionForSelect = {
  value?: number | string | undefined;
  text?: string;
  range?: Range;
  params?: Record<string, A>;
  data?: Record<string, A>;
  count?: number;
  long_text?: string;
  description?: string;
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
export const PARAM_PROJECT = 'project_id';
export const PARAM_SORT = 'sort';

export const enum FilterFieldName {
  None = 'none',
  FilterOverview = 'filterOverview',
  BusinessType = 'businessType',
  CategoryType = 'categoryType',
  ProfileLocations = 'profileLocations',
  Locations = 'locations',
  Price = 'price',
  Area = 'area',
  Rooms = 'rooms',
  Bed = 'bed',
  Bath = 'bath',
  Direction = 'direction',
  City = 'city',
  District = 'district',
  Ward = 'ward',
  Project = 'project',
  Sort = 'sort',
  BusCatType = 'busCatType',
  AggProjects = 'aggProjects',
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
  'project',
  'sort',
  'busCatType',
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
  project: PARAM_PROJECT,
  sort: PARAM_SORT,
};
