
import { API_ROUTES } from '@common/router';
import axiosInstance from '@api/axiosInstance';
import { ProductQuery } from '../data/schemas/product-query-schema';
import { SetUpAutoRefreshProductInput, ShowOnFrontEndProductInput, UpVipProductInput } from '../data/schemas/product-action-schema';

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
    data.price && params.append('price', data.price);
    data.area && params.append('area', data.area);
    data.floors_count && params.append('floors_count', data.floors_count);
    data.directions && params.append('directions', data.directions);
    data.furnitures && params.append('furnitures', data.furnitures);

    data.mat_tien && params.append('mat_tien', data.mat_tien);
    data.bedrooms_count && params.append('bedrooms_count', data.bedrooms_count);
    data.bathrooms_count && params.append('bathrooms_count', data.bathrooms_count);
    data.selected_ids && params.append('selected_ids', data.selected_ids);
    data.sort_by && params.append('sort_by', data.sort_by);
    data.sort_direction && params.append('sort_direction', data.sort_direction);
    data.page && params.append('page', data.page.toString());
    data.per_page && params.append('per_page', data.per_page.toString());

    const response = await axiosInstance.get(`${API_ROUTES.PRODUCTS.END_POINT}?${params.toString()}`);

    return response;
  },

  GetUpVipSettings: async () => {
    const response = await axiosInstance.get(`${API_ROUTES.PRODUCTS.GET_UP_VIP_SETTINGS}`);

    return response;
  },

  UpVip: async (data: UpVipProductInput) => {
    const formData = new FormData();
    formData.append('product_id', data.product_id);
    formData.append('ads_type', data.ads_type);
    formData.append('number_of_day', data.number_of_day);

    const response = await axiosInstance.postForm(`${API_ROUTES.PRODUCTS.UP_VIP}`, formData);

    return response;
  },

  ValidateUpVip: async (data: UpVipProductInput) => {
    const formData = new FormData();
    formData.append('product_id', data.product_id);
    formData.append('ads_type', data.ads_type);
    formData.append('number_of_day', data.number_of_day);

    const response = await axiosInstance.postForm(`${API_ROUTES.PRODUCTS.VALIDATE_UP_VIP}`, formData);

    return response;
  },

  ShowOnFrontend: async (data: ShowOnFrontEndProductInput) => {
    const formData = new FormData();
    formData.append('show_on_frontend', String(data.showOnFrontEnd));

    const response = await axiosInstance.postForm(`${API_ROUTES.PRODUCTS.SHOW_ON_FRONTEND.replace("{product_id}", data.productId)}`, formData);

    return response;
  },

  Refresh: async (data: {
    productId: string;
  }) => {
    const response = await axiosInstance.postForm(`${API_ROUTES.PRODUCTS.REFRESH.replace("{product_id}", data.productId)}`);

    return response;
  },

  SetUpAutoRefresh: async (data: SetUpAutoRefreshProductInput) => {
    const formData = new FormData();
    formData.append('auto_refresh', String(data.autoRefresh));

    const response = await axiosInstance.postForm(`${API_ROUTES.PRODUCTS.SETUP_AUTO_REFRESH.replace("{product_id}", data.productId)}`, formData);

    return response;
  },
};

export default ProductApiService;