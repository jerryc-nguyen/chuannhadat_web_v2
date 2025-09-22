/**
 * General application constants
 * Contains app-wide configuration, default values, and constants
 */

export const DEFAULT_LOGO = 'https://images.chuannhadat.com/images/logo_mobile@2x.png?f=webp';
export const LOGO_LONG = 'https://images.chuannhadat.com/images/logo_long@2x.png?f=webp';
export const DEFAULT_AVATAR = 'https://images.chuannhadat.com/images/avatars/gg_avatar.png?f=webp';
/**
 * Default page sizes and pagination
 */
export const defaultPageSize = 10;
export const defaultPageNumber = 1;

/**
 * Default UI classes and styling
 */
export const DEFAULT_BG_CLASS = 'bg-ios-light-surface dark:bg-ios-dark-surface';

/**
 * Session and timeout configuration
 */
export const timeOutDuration = 15 * 3600 * 1000; // 15 hours (15 * 60 * 60 * 1000)

/**
 * Default images and placeholders
 */
export const DEFAULT_THUMB_IMAGE =
  'https://images.chuannhadat.com/images/placeholders/list-item-placeholder.png';

/**
 * Business constants
 */
export const ONE_BILLION = 1_000_000_000;

/**
 * Generic filter options
 */
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

/**
 * Sort options for product listings
 */
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

/**
 * React Query keys for caching
 */
export const QUERY_KEY = {
  LOGIN: ['login'],
  USER: ['user'],
  DETAIL_PRODUCT: ['detail_product'],
  BALANCE: ['balance'],
};

/**
 * Color scheme for notifications and status indicators
 */
export const CND_TEXT_COLORS = {
  Success: 'text-green-600',
  Warning: 'text-amber-500',
  Error: 'text-rose-700',
  Info: 'text-cyan-500',
};

/**
 * Advertisement types mapping
 */
export const ADS_TYPES: Record<string, any> = {
  vip_1: 'Siêu VIP',
  vip_2: 'VIP+',
  vip_3: 'VIP',
  normal: 'Tin thường',
};
