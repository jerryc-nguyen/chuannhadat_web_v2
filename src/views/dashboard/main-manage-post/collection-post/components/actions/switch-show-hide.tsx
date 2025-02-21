'use client';

import { Switch } from '@components/ui/switch';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ProductApiService from '../../apis/product-api';
import {
    ShowOnFrontEndProductInput
} from '../../data/schemas';


export const SwitchButtonToggleShowOnFrontEnd = ({
  productId,
  visible,
}: {
  productId: string;
  visible: boolean;
}) => {
  const [checked, setChecked] = useState<boolean>(visible);

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
    } catch (err) {
      setChecked(!data.showOnFrontEnd);
      console.error('handleShowOnFrontend error', err);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm md:text-base">
      <span>Ẩn tin</span>
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
      <span>Hiện tin</span>
    </div>
  );
};
