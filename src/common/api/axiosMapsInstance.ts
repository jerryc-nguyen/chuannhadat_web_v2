import axios, { AxiosResponse, AxiosError } from 'axios';
import { get } from 'lodash-es';

const DEFAULT_AXIOS_TIMEOUT = 60 * 1000; // 60S
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosMapsInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  baseURL: baseUrl,
  timeout: DEFAULT_AXIOS_TIMEOUT,
  validateStatus: function (status: number) {
    return status >= 200 && status < 300;
  },
});

axiosMapsInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    const errorResponse = {
      status: get(error, 'response.status', null),
      message: get(error, 'response.data.message', null),
      errors: get(error, 'response.data.errors', null),
    };
    return Promise.reject(errorResponse);
  }
);

export default axiosMapsInstance;
