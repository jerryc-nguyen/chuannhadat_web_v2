import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { services } from './services';
import { ICommonResponse, IReponseError } from '@common/typeResponse';
import { IProductDetail } from '@mobile/searchs/type';
import { QUERY_KEY } from '@common/constants';

export function useGetDetailProduct(product_uid: string) {
  const { data, error, ...rest } = useQuery<
    ICommonResponse<IProductDetail>,
    IReponseError
  >({
    queryKey: [...QUERY_KEY.DETAIL_PRODUCT, product_uid],
    queryFn: async () => services.products.getDetailProduct(product_uid),
  });
  return { data, error, ...rest };
}
