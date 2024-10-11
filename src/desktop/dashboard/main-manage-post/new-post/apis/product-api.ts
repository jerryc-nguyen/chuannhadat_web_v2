
import { API_ROUTES } from '@common/router';
import { IProductForm } from '../type';
import axiosInstance from '@api/axiosInstance';

const ProductApiService = {
  Create: async (data: IProductForm) => {

    const params = new FormData();
    data.business_type && params.append('business_type', data.business_type);
    data.category_type && params.append('category_type', data.category_type);
    data.title && params.append('title', data.title);
    data.description && params.append('description', data.description);
    data.area && params.append('area', data.area);
    data.phap_ly && params.append('phap_ly', data.phap_ly);
    data.price_in_vnd && params.append('price_in_vnd', data.price_in_vnd);
    data.city_id && params.append('city_id', data.city_id);
    data.district_id && params.append('district_id', data.district_id);
    data.ward_id && params.append('ward_id', data.ward_id);
    data.street_id && params.append('street_id', data.street_id);
    data.project_id && params.append('project_id', data.project_id);
    data.full_address && params.append('full_address', data.full_address);
    data.bedrooms_count && params.append('bedrooms_count', data.bedrooms_count);
    data.bathrooms_count && params.append('bathrooms_count', data.bathrooms_count);
    data.facade && params.append('facade', data.facade.toString());
    data.entrance && params.append('entrance', data.entrance.toString());
    data.floors_count && params.append('floors_count', data.floors_count);
    data.entrance_direction && params.append('entrance_direction', data.entrance_direction);
    data.view_direction && params.append('view_direction', data.view_direction);
    data.furniture && params.append('furniture', data.furniture);
    data.image_ids && params.append('image_ids', data.image_ids);
    data.youtube_url && params.append('youtube_url', data.youtube_url);

    const response = await axiosInstance.post(API_ROUTES.PRODUCTS.END_POINT, data);

    return response;
  },
};

export default ProductApiService;
