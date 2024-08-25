import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getRequest } from './services';
import { ICommonResponse, IReponseError } from '@common/typeResponse';
import { IProductDetail } from '@mobile/searchs/type';
import { QUERY_KEY } from '@common/constants';
import { API_ROUTES } from '@common/router';

export function useGetDetailProduct(product_uid: string) {
  const { data, error, ...rest } = useQuery<
    AxiosResponse<ICommonResponse<IProductDetail>>,
    IReponseError
  >({
    queryKey: [...QUERY_KEY.DETAIL_PRODUCT, product_uid],
    queryFn: async () => getRequest({ url: API_ROUTES.PRODUCT_DETAIL(product_uid) }),
  });
  return { data, error, ...rest };
}
