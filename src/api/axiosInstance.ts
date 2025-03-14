import { getTokenClient, getFrontendTokenClient } from '@common/cookies';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { set, get } from 'lodash-es';

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
  validateStatus: function (status: number) {
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

    // Log outgoing requests in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${request.method?.toUpperCase()} ${request.url}`, {
        params: request.params,
        data: request.data,
      });
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
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${requestDuration}ms)`,
      );
    }

    return response.data;
  },
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;

    // Calculate and log response time for errors in development
    if (process.env.NODE_ENV === 'development' && config) {
      const requestStartedAt = get(config, 'meta.requestStartedAt', 0);
      const requestDuration = Date.now() - requestStartedAt;
      console.error(
        `❌ API Error: ${config.method?.toUpperCase()} ${config.url} (${requestDuration}ms)`,
        get(error, 'response.data', error.message),
      );
    }

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
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      console.log(`🔄 Retrying request (${config._retryCount}/${MAX_RETRIES}): ${config.url}`);

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
      // Unauthorized - could handle token refresh or logout here
      console.warn('Authentication error: User may need to re-authenticate');
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
