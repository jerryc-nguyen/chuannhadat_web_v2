/**
 * Constants index - centralized exports for all constants
 * Organized by domain for better discoverability and maintainability
 */

// General application constants
export {
  DEFAULT_BG_CLASS,
  defaultPageSize,
  defaultPageNumber,
  DEFAULT_THUMB_IMAGE,
  ONE_BILLION,
  ALL_VALUE,
  ALL_TEXT,
  ALL_OPTION,
  ALL_FILTER_OPTION,
  DEFAULT_BUSINESS_TYPE_OPTION,
  SORT_OPTIONS,
  QUERY_KEY,
  timeOutDuration,
  CND_TEXT_COLORS,
  ADS_TYPES,
} from './app';

// Bank and payment constants
export {
  SMS_PHONE_NUMBER,
  SMS_SUPPORT_NUMBER,
  BANK_ACCOUNT_NAME,
  BANK_ACCOUNT_NUMBER,
  BANK_CODE,
  BANK_FULL_NAME,
} from './bank';

// User session constant
export const CURRENT_USER_KEY = 'current_user';
