import { AuthUtils } from '@common/auth';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const DEFAULT_AXIOS_TIMEOUT = 60 * 1000; // 60S

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_KEY = '';

const ENDPOINTS_NEED_TO_USE_HEADER: string[] = [];

// This axios instance is used when client is authenticated
const privateAxios: AxiosInstance = axios.create({
  timeout: DEFAULT_AXIOS_TIMEOUT,
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['X-Api-Key'] = API_KEY;

    // Inject token to request header
    const token = AuthUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestUrl = response.config.url;

    if (
      ENDPOINTS_NEED_TO_USE_HEADER.some(
        (resUrl) =>
          `${resUrl}`.toLocaleLowerCase() ===
          requestUrl?.toLocaleLowerCase(),
      )
    ) {
      return response;
    }

    return response.data;
  },
  async (error: AxiosError) => {
    // Handle common errors when necessary such as 401, 403, 404
    return Promise.reject(error);
  },
);

export { privateAxios };
