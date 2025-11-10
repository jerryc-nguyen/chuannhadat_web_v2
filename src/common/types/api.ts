import { HttpStatusCode } from 'axios';

/**
 * Generic API types and response interfaces
 * Used across the application for API communication
 */

// Type for API response
export type IDashboardListFetcherReturn<T> = {
  aggs?: Record<string, any>;
  rows?: T[];
  pagination?: IPagination;
};

/**
 * Generic API response wrapper
 */
export interface IResponseData<T> {
  code?: HttpStatusCode;
  status: boolean | number;
  message?: string;
  data: T;
}

/**
 * Generic API response wrapper
 */
export interface IResponseListData<T> {
  code?: HttpStatusCode;
  status: boolean | number;
  message?: string;
  data: {
    pagination: IPagination;
    results: T[];
  }
}


/**
 * Pagination interface for paginated responses
 */
export interface IPagination {
  total_count: number;
  total_pages: number;
  page: number;
  per_page: number;
}
