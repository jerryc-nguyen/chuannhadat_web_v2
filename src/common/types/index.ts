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
  IPagination,
  IProfileMeResponse,
} from './api';

// Search and filter related types
export type {
  TPhoto,
  Params,
  Range,
  OptionForSelect,
} from './search';

export { FilterFieldName } from './search';
