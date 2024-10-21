import { ProductQueryFieldName } from "../data/type/product-query";

export interface QueryChipOption {
  id: ProductQueryFieldName;
  text: string;
}

export const listChipsQuery: Array<QueryChipOption> = [
    {
      id: ProductQueryFieldName.BusinessType,
      text: 'Loại tin',
    },
    {
      id: ProductQueryFieldName.CategoryType,
      text: 'Loại nhà đất',
    },
    // { id: ProductQueryFieldName.locations, text: 'Khu vực' },
    {
      id: ProductQueryFieldName.Price,
      text: 'Mức giá',
    },
    {
      id: ProductQueryFieldName.Area,
      text: 'Diện tích',
    },
    {
      id: ProductQueryFieldName.FloorCount,
      text: 'Số Phòng',
    },
    {
      id: ProductQueryFieldName.BedroomsCount,
      text: 'Số Phòng Ngủ',
    },
    
    {
      id: ProductQueryFieldName.BathroomsCount,
      text: 'Số Nhà vệ sinh',
    },
    {
      id: ProductQueryFieldName.Directions,
      text: 'Hướng',
    },
    {
      id: ProductQueryFieldName.MatTien,
      text: 'Mặt tiền',
    },
  ];