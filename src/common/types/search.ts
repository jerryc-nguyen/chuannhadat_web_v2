/**
 * Search and filter related types and constants
 * Contains filter parameters, search options, and related functionality
 */


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
