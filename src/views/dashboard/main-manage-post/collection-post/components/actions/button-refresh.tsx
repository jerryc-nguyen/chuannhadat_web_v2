'use client';

import { Button } from '@components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import ProductApiService from '../../apis/product-api';
import useProductActionSetting from '../../hooks/product-action-setting';
import { useManagePostsCache } from '../../hooks/useManagePostsCache';

export const ButtonRefresh = ({ productId }: { productId: string }) => {
  const { productActionSettings, decreaseTotalRefreshsCount } = useProductActionSetting();
  const { updateFieldDataOnRow } = useManagePostsCache();

  const handleRefresh = async () => {
    try {
      const res: A = await ProductApiService.Refresh({
        productId: productId,
      });
      console.log('handleRefresh success response', res);

      if (res.status === true && res.message) {
        toast.success(res.message);
        decreaseTotalRefreshsCount();
        updateFieldDataOnRow(productId, [
          {
            setterKey: 'formatted_published_at',
            newValue: 'Vừa xong',
          },
        ]);
      } else {
        toast.error(res.message);
      }
    } catch (err: A) {
      console.error('handleRefresh error', err);
      const errMsg = err.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(errMsg);
    }
  };

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-1 h-8 justify-start gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} /> <span className="text-sm">Làm mới tin</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {productActionSettings && productActionSettings.total_refreshs_count ? (
            <p>
              Làm mới tin thủ công. Bạn còn lần {productActionSettings.total_refreshs_count} làm mới
            </p>
          ) : (
            <></>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
