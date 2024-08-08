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
    params: {
      sort_by: 'published_at',
      sort_direction: 'desc',
    },
  },
  {
    text: 'Giá theo m² thấp đến cao',
    params: {
      sort_by: 'price_per_m2_in_d',
      sort_direction: 'asc',
    },
  },
  {
    text: 'Giá thấp đến cao',
    params: {
      sort_by: 'price_in_d',
      sort_direction: 'asc',
    },
  },
  {
    text: 'Giá cao đến thấp',
    params: {
      sort_by: 'price_in_d',
      sort_direction: 'desc',
    },
  },
  {
    text: 'Diện tích bé đến lớn',
    params: {
      sort_by: 'area',
      sort_direction: 'asc',
    },
  },
  {
    text: 'Diện tích lớn đến bé',
    params: {
      sort_by: 'area',
      sort_direction: 'desc',
    },
  },
];
