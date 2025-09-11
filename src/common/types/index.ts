/**
 * Types index - centralized exports for all type definitions
 * Organized by domain for better discoverability and maintainability
 */

// User and authentication related types and enums
export type {
  IUserProfile,
  IOAuthPayload,
  IConnectOauthsPayload,
} from './user';

export {
  CustomerType,
  CustomerGender,
} from './user';

// Generic API types and responses
export type {
  IResponseData,
  INotificationResponse,
  INotificationData,
  IPagination,
  INotificationsResponse,
  IReferralsDetailResponse,
  IConnectOauthsResponse,
  IReferralData,
  ITopAuthor,
  IVerifyPhoneResponseData,
  IRequestCallbackContent,
  IViewedPostsResponse,
  IReferralListResponse,
  IProfileMeResponse,
  TopAuthorsResponse,
  IVerifyPhoneResponse,
} from './api';

// Search and filter related types
export type {
  TPhoto,
  Params,
  Range,
  OptionForSelect,
} from './search';

// Save and favorite related types
export type {
  ISaveProductPayload,
  IViewedPostsPayload,
  IRequestCallbackPayload,
  ISearchAuthorPayload,
  ISavesSummaryResponse,
  ISavedProductsResponse,
  ISavedProduct,
} from './saves';

export { ActionSaveProduct } from './saves';

// Export constants from search types
export {
  PARAM_BUSINESS_TYPE,
  PARAM_CATEGORY_TYPE,
  PARAM_PRICE,
  PARAM_AREA,
  PARAM_BED,
  PARAM_BATH,
  PARAM_DIRECTION,
  PARAM_CITY,
  PARAM_DISTRICT,
  PARAM_WARD,
  PARAM_PROJECT,
  PARAM_SORT,
  PARAM_AGG_PROJECTS,
  FilterFieldName,
  FILTER_FIELDS_TO_PARAMS,
  FILTER_FIELDS_PARAMS_MAP,
} from './search';

// ActionSaveProduct is already exported from saves types section above
