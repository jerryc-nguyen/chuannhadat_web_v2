'use client';
import { Checkbox } from '@components/ui/checkbox';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ProductApiService from '../../apis/product-api';
import {
    SetUpAutoRefreshProductInput
} from '../../data/schemas';


export const CheckboxAutoRefresh = ({
  productId,
  auto_refresh_product,
}: {
  productId: string;
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

  return (
    <div className="flex w-max items-center space-x-2 rounded-md border bg-background px-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(checkedState) => {
          if (typeof checkedState === 'boolean') {
            setChecked(checkedState);
            handleSetUpAutoRefresh({
              productId: productId,
              autoRefresh: checkedState,
            });
          }
        }}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Làm mới tin tự động
      </label>
    </div>
  );
};
