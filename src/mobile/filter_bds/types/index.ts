export interface FilterOption {
  text: string;
  params: Record<string, any>;
  count?: number;
}

export interface LocationOption {
  id?: string | number;
  text?: string;
}

export enum FilterFieldName {
  none,
  filterOverview,
  businessType,
  categoryType,
  locations,
  price,
  area,
  bed,
  rooms,
  bath,
  direction,
  city,
  district,
  ward,
}
