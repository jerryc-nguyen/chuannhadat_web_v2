import { getQueryClient } from '@api/react-query';
import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash-es';
import ProductApiService from '../apis/product-api';
import { ProductActionSetting } from '../data/type/products-action-settings';

export default function useProductActionSetting() {
  const { isLoading, data } = useQuery({
    queryKey: ['productActionSettings'],
    queryFn: async () => {
      const result = await ProductApiService.GetProductActionSettings();
      return result.data as ProductActionSetting;
    },
  });

  const decreaseTotalRefreshsCount = () => {
    const cache = getQueryClient().getQueryData(['productActionSettings']);
    if (get(cache, 'total_refreshs_count', 0) <= 0) return;

    getQueryClient().setQueryData(['productActionSettings'], (prev: ProductActionSetting) => {
      return { ...prev, total_refreshs_count: prev.total_refreshs_count - 1 };
    });
  };

  return {
    isLoadingProductActionSetting: isLoading,
    productActionSettings: data,
    decreaseTotalRefreshsCount,
  };
}
