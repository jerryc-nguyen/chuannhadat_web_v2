import { API_ROUTES } from '@common/router';
import axiosInstance from '@common/api/axiosInstance';
import { ProductQuery } from '../schemas/ProductQuerySchema';
import { SetUpAutoRefreshProductInput, ShowOnFrontEndProductInput, UpVipProductInput } from '../schemas/UpVipProductInputSchema';

const ProductApiService = {
  Filter: async (data: ProductQuery) => {
    const params = new URLSearchParams();
    data.business_type && params.append('business_type', data.business_type);
    data.category_type && params.append('category_type', data.category_type);
    data.city_id && params.append('city_id', data.city_id);
    data.district_id && params.append('district_id', data.district_id);
    data.ward_id && params.append('ward_id', data.ward_id);
    data.street_id && params.append('street_id', data.street_id);
    data.project_id && params.append('project_id', data.project_id);
    data.floors_count && params.append('floors_count', data.floors_count);
    data.furnitures && params.append('furnitures', data.furnitures);
    data.mat_tien && params.append('mat_tien', data.mat_tien);
    data.selected_ids && params.append('selected_ids', data.selected_ids);
    data.sort_by && params.append('sort_by', data.sort_by);
    data.sort_direction && params.append('sort_direction', data.sort_direction);
    data.page && params.append('page', data.page.toString());
    data.per_page && params.append('per_page', data.per_page.toString());

    data.visibility && params.append("visibility", data.visibility);
    data.search_by && params.append("search_by", data.search_by);
    data.search_value && params.append("search_value", data.search_value);
    data.filter_chips && params.append("filter_chips", data.filter_chips);
    params.append("aggs_for", 'manage_posts');
    const response = await axiosInstance.get(`${API_ROUTES.MANAGE_PRODUCTS.END_POINT}?${params.toString()}`);

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
