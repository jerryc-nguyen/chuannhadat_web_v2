'use client';
import { Checkbox } from '@components/ui/checkbox';
import { useState } from 'react';
import ProductApiService from '../../apis/product-api';

import { toast } from 'sonner';
import { SetUpAutoRefreshProductInput } from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2/schemas/UpVipProductInputSchema';

export const CheckboxAutoRefresh = ({
  productId,
  auto_refresh_product,
}: {
  productId: number;
  auto_refresh_product: boolean;
}) => {
  const [checked, setChecked] = useState<boolean>(auto_refresh_product);

  const handleSetUpAutoRefresh = async (data: SetUpAutoRefreshProductInput) => {
    try {
      const res: A = await ProductApiService.SetUpAutoRefresh(data);
      console.log('handleSetUpAutoRefresh success response', res);

      if (res.status === true && res.message) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setChecked(!data.autoRefresh);
      }
    } catch (err) {
      setChecked(!data.autoRefresh);
      console.error('handleSetUpAutoRefresh error', err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  const handleCheckOnLabel = () => {
    const newCheck = !checked;
    setChecked(newCheck);
    handleSetUpAutoRefresh({
      productId: productId,
      autoRefresh: newCheck,
    });
  }

  return (
    <div className="flex w-max items-center space-x-2 rounded-md border bg-background px-2 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); handleCheckOnLabel() }}>
      <Checkbox
        checked={checked}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:opacity-70 cursor-pointer"
      >
        Làm mới tự động
      </label>
    </div>
  );
};
