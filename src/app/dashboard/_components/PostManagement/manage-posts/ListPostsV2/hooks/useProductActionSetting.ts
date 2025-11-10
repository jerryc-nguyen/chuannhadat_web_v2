import { getQueryClient } from '@common/api/react-query';
import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash-es';
import ProductApiService from '../apis/product-api';
import { ProductActionSetting } from '../types/products-action-settings';

export default function useProductActionSetting() {
  const { isLoading, data } = useQuery({
    queryKey: ['manage_products/settings'],
    queryFn: async () => {
      const result = await ProductApiService.GetProductActionSettings();
      return result.data as ProductActionSetting;
    },
  });

  const decreaseTotalRefreshsCount = () => {
    const cache = getQueryClient().getQueryData(['manage_products/settings']);
    if (get(cache, 'total_refreshs_count', 0) <= 0) return;

    getQueryClient().setQueryData(['manage_products/settings'], (prev: ProductActionSetting) => {
      return { ...prev, total_refreshs_count: prev.total_refreshs_count - 1 };
    });
  };

  return {
    isLoadingProductActionSetting: isLoading,
    productActionSettings: data,
    decreaseTotalRefreshsCount,
  };
}
