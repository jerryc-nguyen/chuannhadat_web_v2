import { FilterFieldName, OptionForSelect } from '@models';

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
  sort?: OptionForSelect;
  busCatType?: OptionForSelect
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
