export interface FilterOption {
  text: string;
  params: Record<string, any>;
  group?: number;
  count?: number;
}

export enum FilterFieldName {
  none,
  locations,
  propertyType,
  price,
  area,
  beds,
  baths,
  direction
}

export interface FilterState {
  bedOptions: FilterOption[];
  bathOptions: FilterOption[];
  priceOptions: FilterOption[];
  areaOptions: FilterOption[];
  directionOptions: FilterOption[];
  propertyTypeOptions: FilterOption[];
  selectedBedOption?: FilterOption;
  selectedBathOption?: FilterOption;
  selectedPriceOption?: FilterOption;
  selectedAreaOption?: FilterOption;
  selectedDirectionOption?: FilterOption;
  selectedPropertyTypeOption?: FilterOption;
  selectedCity?: FilterOption;
  selectedDistrict?: FilterOption;
  selectedWard?: FilterOption;
}
