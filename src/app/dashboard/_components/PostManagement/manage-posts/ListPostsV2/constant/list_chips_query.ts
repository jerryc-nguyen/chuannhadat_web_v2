import { FilterFieldName } from '@common/types';
import { ProductQueryFieldName } from '../types/product-query';
import { FilterChipOption } from '@common/types';

export interface QueryChipOption {
  id: ProductQueryFieldName;
  text: string;
}

export const listChipsQuery: Array<FilterChipOption> = [
  {
    id: FilterFieldName.BusCatType,
    text: 'Phân loại',
  },
  { id: FilterFieldName.ProfileLocations, text: 'Khu vực' },
  {
    id: FilterFieldName.Price,
    text: 'Mức giá',
  },
  {
    id: FilterFieldName.Area,
    text: 'Diện tích',
  },
  {
    id: FilterFieldName.Rooms,
    text: 'Số Phòng',
  },
  {
    id: FilterFieldName.Direction,
    text: 'Hướng',
  },
  {
    id: FilterFieldName.Sort,
    text: 'Sắp xếp',
  },
];
