'use client';

import { Switch } from '@components/ui/switch';
import { useState, useEffect } from 'react';
import ProductApiService from '../../apis/product-api';
import { useManagePostsCache } from '../../hooks/useManagePostsCache';
import { toast } from 'sonner';
import { useApp } from '@common/context/AppContext';
import { ShowOnFrontEndProductInput } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/UpVipProductInputSchema';

export const SwitchButtonToggleShowOnFrontEnd = ({
  productId,
  visible,
}: {
  productId: number;
  visible: boolean;
}) => {
  const { isMobile } = useApp()
  const [checked, setChecked] = useState<boolean>(visible);
  const { updateFieldDataOnRow } = useManagePostsCache();

  // Sync local state with prop changes
  useEffect(() => {
    setChecked(visible);
  }, [visible]);

  const handleShowOnFrontend = async (data: ShowOnFrontEndProductInput) => {
    try {
      const res: A = await ProductApiService.ShowOnFrontend(data);
      console.log('handleShowOnFrontend success response', res);
      if (res.status === true && res.message) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setChecked(!data.showOnFrontEnd);
      }
      // Update cache data
      updateFieldDataOnRow(productId, [
        {
          setterKey: 'visible',
          newValue: data.showOnFrontEnd,
        },
      ]);
    } catch (err) {
      setChecked(!data.showOnFrontEnd);
      console.error('handleShowOnFrontend error', err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {isMobile ? (
        // Mobile: Compact design with just switch
        <Switch
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(checked);
            handleShowOnFrontend({
              productId: productId,
              showOnFrontEnd: checked,
            });
          }}
          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400"
        />
      ) : (
        // Desktop: Full labels
        <>
          <span className="text-sm whitespace-nowrap">Ẩn tin</span>
          <Switch
            checked={checked}
            onCheckedChange={(checked) => {
              setChecked(checked);
              handleShowOnFrontend({
                productId: productId,
                showOnFrontEnd: checked,
              });
            }}
          />
          <span className="text-sm whitespace-nowrap">Hiện tin</span>
        </>
      )}
    </div>
  );
};
