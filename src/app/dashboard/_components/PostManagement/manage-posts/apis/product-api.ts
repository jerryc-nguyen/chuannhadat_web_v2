
import { API_ROUTES } from '@common/router';
import axiosInstance from '@common/api/axiosInstance';
import { IManageProductDetail } from '../../types';

const ManageProductApis = {
  getDetail: async (product_uid: string): Promise<{ data: IManageProductDetail }> => {
    return axiosInstance.get(`${API_ROUTES.MANAGE_PRODUCTS.DETAIL}/${product_uid}`);
  },
  Create: async (params: A) => {
    return axiosInstance.post(API_ROUTES.MANAGE_PRODUCTS.END_POINT, params);
  },
  Update: (id: number, params: A) => {
    params.id = id
    return axiosInstance.put(API_ROUTES.MANAGE_PRODUCTS.END_POINT, params);
  },
};

export default ManageProductApis;
