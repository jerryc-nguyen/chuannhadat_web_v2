export const ALL_VALUE = 'all';
export const ALL_TEXT = 'Tất cả';
export const ALL_OPTION = { value: ALL_VALUE, text: ALL_TEXT };
export const ALL_FILTER_OPTION = {
  id: ALL_VALUE,
  text: ALL_TEXT,
  params: {},
};
export const DEFAULT_BUSINESS_TYPE_OPTION = {
  value: 'sell',
  text: 'Bán',
};

export const SORT_OPTIONS = [
  {
    text: 'Tin mới nhất',
    value: 'published_at_desc',
  },
  {
    text: 'Giá theo m² thấp đến cao',
    value: 'price_per_m2_asc',
  },
  {
    text: 'Giá thấp đến cao',
    value: 'price_asc',
  },
  {
    text: 'Giá cao đến thấp',
    value: 'price_desc',
  },
  {
    text: 'Diện tích bé đến lớn',
    value: 'area_asc',
  },
  {
    text: 'Diện tích lớn đến bé',
    value: 'area_desc',
  },
];
