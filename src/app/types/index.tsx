export type Range = {
  min?: number;
  max?: number;
};

export type OptionForSelect = {
  value: number | string;
  text: string;
  range?: Range;
};

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
