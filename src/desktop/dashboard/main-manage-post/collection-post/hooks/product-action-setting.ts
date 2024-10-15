import { useState } from 'react';
import { useAtom } from 'jotai';
import { ProductActionSetting } from '../data/type/products-action-settings';
import ProductApiService from '../apis/product-api';
import { productActionSetting } from '../states';
import { AxiosResponse } from 'axios';

export default function useProductActionSetting() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productActionSettings, setProductActionSettings] = useAtom(productActionSetting);

    const handleGetProductActionSettings = async () => {
        setIsLoading(true);
        try {
            const res: AxiosResponse<ProductActionSetting> = await ProductApiService.GetProductActionSettings();
            setProductActionSettings(res.data);
        } catch (err) {
            console.error("handleFilter error", err);
            setProductActionSettings(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    const decreaseTotalRefreshsCount = () => {
        if ( !productActionSettings || productActionSettings.total_refreshs_count <= 0) return;
        
        setProductActionSettings(prev => {
            if (!prev) return prev;
            
            return {...prev, total_refreshs_count: prev.total_refreshs_count -1}
        })
    }

    return {
        isLoadingProductActionSetting: isLoading,
        handleGetProductActionSettings,
        productActionSettings,
        decreaseTotalRefreshsCount
    };
}
