import { getFrontendTokenClient, getTokenClient, removeTokenClient } from '@common/cookies';
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { get, set } from 'lodash-es';

// Configuration constants
const DEFAULT_AXIOS_TIMEOUT = 60 * 1000; // 60 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504]; // Status codes that should trigger a retry

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Flag to prevent multiple auth error handlers from triggering at once
let isHandlingAuthError = false;

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

// Handle authentication errors by logging out the user
const handleAuthError = () => {
  // Prevent multiple handlers from triggering at once
  if (isHandlingAuthError) return;

  try {
    isHandlingAuthError = true;

    // Remove authentication tokens
    removeTokenClient();

    // Store the current path for redirect after login
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      } catch (e) {
        console.error('Failed to store redirect path:', e);
      }

      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  } catch (e) {
    console.error('Error handling auth error:', e);
  } finally {
    // Reset flag after a delay to prevent further errors during redirect
    setTimeout(() => {
      isHandlingAuthError = false;
    }, 1000);
  }
};

// Response interceptor for handling responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate and log response time in development
    if (process.env.NODE_ENV === 'development') {
      const requestStartedAt = get(response.config, 'meta.requestStartedAt', 0);
      const requestDuration = Date.now() - requestStartedAt;
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

    // Format error response consistently
    const errorResponse = {
      status: get(error, 'response.status', null),
      message: get(error, 'response.data.message', error.message || 'Unknown error occurred'),
      errors: get(error, 'response.data.errors', null),
      url: config?.url,
      method: config?.method,
    };

    // Handle specific error cases
    if (!error.response) {
      // Network error (no response from server)
      errorResponse.message = 'Network error: Unable to connect to server';
    } else if (error.response.status === 401) {
      // Unauthorized - handle token expiration with logout
      console.warn('Authentication error: Token expired or invalid');

      // Don't handle auth errors for login/register endpoints
      const isAuthEndpoint =
        config?.url?.includes('/auth/login') || config?.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        handleAuthError();
      }
    } else if (error.response.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn('Permission error: User lacks required permission');
    } else if (error.response.status === 404) {
      // Resource not found
      errorResponse.message = `Resource not found: ${config?.url}`;
    } else if (error.response.status >= 500) {
      // Server error
      console.error('Server error occurred:', errorResponse);
    }

    return Promise.reject(errorResponse);
  },
);

// Create utility function to cancel requests
const cancelTokenSource = () => axios.CancelToken.source();

export { cancelTokenSource };
export default axiosInstance;
