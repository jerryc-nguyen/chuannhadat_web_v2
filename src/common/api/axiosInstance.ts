import { getFrontendTokenClient, getTokenClient } from '@common/cookies';
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { get, set } from 'lodash-es';
import { trackError } from '@common/features/track_errors';
import { API_ROUTES } from '@common/router';

// Configuration constants
const DEFAULT_AXIOS_TIMEOUT = 60 * 1000; // 60 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504]; // Status codes that should trigger a retry

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create a custom axios instance
const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  baseURL: baseUrl,
  timeout: DEFAULT_AXIOS_TIMEOUT,
  validateStatus: (status: number) => {
    // Only resolve for successful responses
    return status >= 200 && status < 300;
  },
});

// Request interceptor for handling authentication and other pre-request tasks
axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig<A>) => {
    // Add request start timestamp for monitoring response time
    set(request, 'meta.requestStartedAt', Date.now());

    // Add authentication tokens
    const accessToken = getTokenClient();
    if (accessToken) {
      set(request, 'headers.Authorization', `Bearer ${accessToken}`);
    }

    const frontendToken = getFrontendTokenClient();
    if (frontendToken) {
      set(request, 'headers.Frontend-Token', frontendToken);
    }

    return request;
  },
  (error: A) => {
    // Handle request setup errors (rare, but can happen)
    console.error('Request setup error:', error);

    const errorResponse = {
      status: null,
      message: 'Network error occurred while setting up the request',
      errors: error,
    };
    return Promise.reject(errorResponse);
  },
);

// Define a type for config with retry count
interface RetryConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

// Response interceptor for handling responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate and log response time in development
    if (process.env.NODE_ENV === 'development') {
      const requestStartedAt = get(response.config, 'meta.requestStartedAt', 0);
      const requestDuration = Date.now() - requestStartedAt;
      console.log(`API Request to ${response.config.url} took ${requestDuration}ms`);
    }

    return response.data;
  },
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    // Implement retry logic for network errors or specific HTTP error codes
    if (
      config && // Make sure config exists
      (error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT' ||
        error.message.includes('Network Error') ||
        (error.response && RETRY_STATUS_CODES.includes(error.response.status))) &&
      (!config._retryCount || config._retryCount < MAX_RETRIES)
    ) {
      // Initialize retry count if undefined
      config._retryCount = (config._retryCount || 0) + 1;

      // Create a delay before retrying the request
      const retryDelay = RETRY_DELAY * config._retryCount;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      // Retry the request
      return axiosInstance(config);
    }

    // Handle side effects for specific error cases
    if (!error.response) {
      // Network error (no response from server)
      console.error('Network error: Unable to connect to server', { url: config?.url });
    } else if (error.response.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn('Permission error: User lacks required permission');
    } else if (error.response.status >= 500) {
      // Server error
      const serverMessage = (error.response.data as { message?: string })?.message;
      console.error('Server error occurred:', {
        status: error.response.status,
        url: config?.url,
        message: serverMessage || error.message,
      });
    }

    // Enhance error message with server message if available (for better user experience)
    // but keep the original AxiosError structure
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      const serverMessage = (error.response.data as { message: string }).message;
      if (serverMessage && serverMessage !== error.message) {
        error.message = serverMessage;
      }
    }

    // Track API exceptions to server (fire and forget - don't await to avoid blocking)
    // Skip tracking if this is an error from the error tracking endpoint itself (avoid infinite loop)
    if (config?.url && !config.url.includes(API_ROUTES.TRACKINGS.ERRORS)) {
      const serverMessage = error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? (error.response.data as { message: string }).message
        : null;

      // Try to parse config.data as JSON if it's a string
      let requestData = config.data || null;
      if (requestData && typeof requestData === 'string') {
        try {
          requestData = JSON.parse(requestData);
        } catch {
          // If parsing fails, keep the original string
          // requestData remains as the original string
        }
      }

      trackError(error, 'api_exception', {
        api_url: config.url || null,
        api_method: config.method?.toUpperCase() || null,
        http_status: error.response?.status || null,
        server_message: serverMessage,
        response_data: error.response?.data || null,
        request_data: requestData,
      }).catch(() => {
        // Silently ignore tracking errors
      });
    }

    // Return the original AxiosError - it already extends Error and contains all necessary information
    // Consuming code can access: error.response.status, error.response.data, error.message, etc.
    return Promise.reject(error);
  },
);

// Create utility function to cancel requests
const cancelTokenSource = () => axios.CancelToken.source();

export { cancelTokenSource };
export default axiosInstance;
