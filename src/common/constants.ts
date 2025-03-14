export const DEFAULT_BG_CLASS = 'bg-ios-light-surface dark:bg-ios-dark-surface';
export const CURRENT_USER_KEY = 'current_user';
export const SMS_PHONE_NUMBER = '0967.354.632';
export const SMS_SUPPORT_NUMBER = '0966662192';
export const BANK_ACCOUNT_NAME = 'NGUYEN VAN LINH';
export const BANK_ACCOUNT_NUMBER = '519 3839 8888';
export const BANK_CODE = 'TPBank';
export const BANK_FULL_NAME = 'Ngân hàng Tiên Phong';
export const ONE_BILLION = 1_000_000_000;
export const ALL_VALUE = 'all';
export const ALL_TEXT = 'Tất cả';
export const ALL_OPTION = {
  value: ALL_VALUE,
  text: ALL_TEXT,
};
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

export const QUERY_KEY = {
  LOGIN: ['login'],
  USER: ['user'],
  DETAIL_PRODUCT: ['detail_product'],
  BALANCE: ['balance'],
};

export const timeOutDuration = 15 * 3600 * 1000; // 15 hours (15 * 60 * 60 * 1000)

export const CND_TEXT_COLORS = {
  Success: 'text-green-600',
  Warning: 'text-amber-500',
  Error: 'text-rose-700',
  Info: 'text-cyan-500',
};

export const ADS_TYPES: Record<string, A> = {
  vip_1: 'Siêu VIP',
  vip_2: 'VIP+',
  vip_3: 'VIP',
  normal: 'Tin thường',
};
export const defaultPageSize = 10;
export const defaultPageNumber = 1;
export const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/product-images/23421/B%C3%A1n-Nh%C3%A0-m%E1%BA%B7t-ph%E1%BB%91-%C4%90%C6%B0%E1%BB%9Dng-Th%E1%BA%A1nh-L%E1%BB%99c-41-Qu%E1%BA%ADn-12--Di%E1%BB%87n-t%C3%ADch-396m2_c98722_big.jpg?crop=true&height=270&width=480';
