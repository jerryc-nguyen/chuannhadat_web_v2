import { API_ROUTES } from '@common/router';
import axiosInstance from '@common/api/axiosInstance';
import { SetUpAutoRefreshProductInput, ShowOnFrontEndProductInput, UpVipProductInput } from '../schemas/UpVipProductInputSchema';
import { removeEmpty } from '@common/utils';
const ProductApiService = {
  Filter: async (data: Record<string, any>) => {
    const queryData = removeEmpty(data);
    const response = await axiosInstance.get(`${API_ROUTES.MANAGE_PRODUCTS.END_POINT}?${new URLSearchParams(queryData).toString()}`);

    // Our axios instance already returns response.data (payload object).
    // Keep returning the payload so controllers can read { data, pagination }.
    return response;
  },

  GetProductActionSettings: async () => {
    const response = await axiosInstance.get(`${API_ROUTES.MANAGE_PRODUCTS.GET_PRODUCT_ACTION_SETTINGS}`);

    return response;
  },

  UpVip: async (data: UpVipProductInput) => {
    const formData = new FormData();
    formData.append('product_id', data.product_id.toString());
    formData.append('ads_type', data.ads_type);
    formData.append('number_of_day', data.number_of_day.toString());

    const response = await axiosInstance.postForm(`${API_ROUTES.MANAGE_PRODUCTS.UP_VIP}`, formData);

    return response;
  },

  ValidateUpVip: async (data: UpVipProductInput) => {
    const formData = new FormData();
    formData.append('product_id', data.product_id.toString());
    formData.append('ads_type', data.ads_type);
    formData.append('number_of_day', data.number_of_day.toString());

    const response = await axiosInstance.postForm(`${API_ROUTES.MANAGE_PRODUCTS.VALIDATE_UP_VIP}`, formData);

    return response;
  },

  ShowOnFrontend: async (data: ShowOnFrontEndProductInput) => {
    const formData = new FormData();
    formData.append('show_on_frontend', String(data.showOnFrontEnd));

    const response = await axiosInstance.postForm(`${API_ROUTES.MANAGE_PRODUCTS.SHOW_ON_FRONTEND.replace("{product_id}", data.productId.toString())}`, formData);

    return response;
  },

  Refresh: async (data: {
    productId: number;
  }) => {
    const response = await axiosInstance.postForm(`${API_ROUTES.MANAGE_PRODUCTS.REFRESH.replace("{product_id}", data.productId.toString())}`);

    return response;
  },

  SetUpAutoRefresh: async (data: SetUpAutoRefreshProductInput) => {
    const formData = new FormData();
    formData.append('auto_refresh', String(data.autoRefresh));

    const response = await axiosInstance.postForm(`${API_ROUTES.MANAGE_PRODUCTS.SETUP_AUTO_REFRESH.replace("{product_id}", data.productId.toString())}`, formData);

    return response;
  },

  Delete: async (data: {
    productId: number;
  }) => {
    const response = await axiosInstance.delete(`${API_ROUTES.MANAGE_PRODUCTS.DELETE.replace("{product_id}", data.productId.toString())}`);

    return response;
  },
};

export default ProductApiService;
