import React from 'react';
import { Button } from '@components/ui/button';
import { Service } from '../../types';

interface PaymentDialogProps {
  plan: Service;
  onBuy: (planId: number) => void;
  isLoading: boolean;
}

export const BuyButton: React.FC<PaymentDialogProps> = ({ plan, onBuy, isLoading }) => {
  return (<Button variant="default" className='w-full mt-4' onClick={() => onBuy(plan.plan_id)} disabled={isLoading}>
    {isLoading ? 'Đang xử lý...' : 'Mua'}
  </Button>)
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({ plan, onBuy, isLoading }) => {
  return (
    <div className='w-full'>
      <div className="w-full rounded-lg bg-white p-4 shadow-md">
        <img
          src={plan.image_url}
          alt={plan.plan_name}
          className="w-full rounded-lg object-contain"
        />
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-medium">Thông tin thanh toán</h3>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Giá</span>
              <span>{plan.buy_info.total.toLocaleString()} Xu</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span className="text-gray-600">Giảm giá</span>
              <span>
                {plan.buy_info.discount > 0
                  ? `-${plan.buy_info.discount.toLocaleString()} Xu`
                  : `0 Xu`}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span className="text-gray-900">Tổng cộng</span>
              <span>{plan.buy_info.formatted_total}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
