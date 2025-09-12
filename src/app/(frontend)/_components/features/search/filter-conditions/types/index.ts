import { OptionForSelect } from '@common/types';


export interface FilterState {
  businessType?: OptionForSelect;
  categoryType?: OptionForSelect;
  bed?: OptionForSelect;
  bath?: OptionForSelect;
  price?: OptionForSelect;
  area?: OptionForSelect;
  direction?: OptionForSelect;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  project?: OptionForSelect;
  sort?: OptionForSelect;
  busCatType?: OptionForSelect;
  [key: string]: OptionForSelect | undefined;
}

export interface FilterFieldOptions {
  businessTypeOptions: OptionForSelect[];
  categoryTypeOptions: OptionForSelect[];
  bedOptions: OptionForSelect[];
  bathOptions: OptionForSelect[];
  priceOptions: OptionForSelect[];
  areaOptions: OptionForSelect[];
  directionOptions: OptionForSelect[];
  roomOptions: OptionForSelect[];
}
export interface FilterChipOption {
  id: FilterFieldName;
  text: string;
}


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
