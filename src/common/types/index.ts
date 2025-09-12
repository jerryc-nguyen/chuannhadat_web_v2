/**
 * Types index - centralized exports for all type definitions
 * Organized by domain for better discoverability and maintainability
 */

/**
 * Photo type for image objects
 */
export type TPhoto = {
  id: number;
  url: string;
};

// User and authentication related types and enums
export type {
  IUser,
} from './user';

export {
  CustomerType,
  CustomerGender,
} from './user';

// Generic API types and responses
export type {
  IResponseData,
  IPagination,
} from './api';

// Search and filter related types
export type {
  Params,
  Range,
  OptionForSelect,
} from './search';

export { FilterFieldName } from './search';
