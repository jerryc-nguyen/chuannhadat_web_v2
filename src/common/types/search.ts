/**
 * Search and filter related types and constants
 * Contains filter parameters, search options, and related functionality
 */

/**
 * Photo type for image objects
 */
export type TPhoto = {
  id: number;
  url: string;
};

/**
 * Route parameters type for dynamic routes
 */
export type Params = Promise<{ slug: string[] }>;

/**
 * Range type for filter ranges (min/max values)
 */
export type Range = {
  min?: number;
  max?: number;
};

/**
 * Option type for select dropdowns with extended properties
 */
export type OptionForSelect = {
  value?: number | string | undefined;
  text?: string;
  range?: Range;
  params?: Record<string, any>;
  data?: Record<string, any>;
  count?: number;
  long_text?: string;
  description?: string;
};

/**
 * Parameter constants for API query strings
 */
export const PARAM_BUSINESS_TYPE = 'business_type';
export const PARAM_CATEGORY_TYPE = 'category_type';
export const PARAM_PRICE = 'price';
export const PARAM_AREA = 'area';
export const PARAM_BED = 'bedrooms_count';
export const PARAM_BATH = 'bathrooms_count';
export const PARAM_DIRECTION = 'direction';
export const PARAM_CITY = 'city_id';
export const PARAM_DISTRICT = 'district_id';
export const PARAM_WARD = 'ward_id';
export const PARAM_PROJECT = 'project_id';
export const PARAM_SORT = 'sort';
export const PARAM_AGG_PROJECTS = 'project_id';

/**
 * Filter field names enum for consistent field identification
 */
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

/**
 * Array of all filter field names for iteration and validation
 */
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
  'aggProjects',
];

/**
 * Mapping of filter field names to their corresponding API parameter names
 */
export const FILTER_FIELDS_PARAMS_MAP: Record<string, any> = {
  businessType: PARAM_BUSINESS_TYPE,
  categoryType: PARAM_CATEGORY_TYPE,
  price: PARAM_PRICE,
  area: PARAM_AREA,
  bed: PARAM_BED,
  bath: PARAM_BATH,
  direction: PARAM_DIRECTION,
  city: PARAM_CITY,
  district: PARAM_DISTRICT,
  ward: PARAM_WARD,
  project: PARAM_PROJECT,
  sort: PARAM_SORT,
  aggProjects: PARAM_AGG_PROJECTS,
};
