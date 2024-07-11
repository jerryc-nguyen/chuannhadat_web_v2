export interface FilterOption {
  text: string;
  params: Record<string, any>;
  count?: number;
}

export enum FilterFieldName {
  none,
  locations,
  categoryType,
  price,
  area,
  bed,
  bath,
  direction,
}
