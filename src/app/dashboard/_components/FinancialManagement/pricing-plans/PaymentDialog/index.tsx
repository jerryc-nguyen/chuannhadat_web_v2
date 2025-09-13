import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@components/ui/button';
import { Service } from '../../types';

interface PaymentDialogProps {
  plan: Service;
  onClose: () => void;
  onBuy: (planId: number) => void;
  isLoading: boolean;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ plan, onClose, onBuy, isLoading }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl'>Thông tin thanh toán</DialogTitle>
        </DialogHeader>
        {/* Pass plan vào component PaymentCard */}
        <div className="max-w-lg rounded-lg bg-white">
          {/* Product Info */}
          <b className="text-lg font-semibold">{plan.plan_name}</b>
          <div className="flex items-center justify-between space-x-4">
            <div className="text-gray-500">{plan.contents[0]?.value} lần</div>
            <div className="ml-auto font-semibold text-gray-700">
              {plan.buy_info.formatted_total}
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 border-t py-4">
            <h3 className="font-medium">Thông tin thanh toán</h3>
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

              <div className="flex justify-between py-2 font-semibold">
                <span className="text-gray-900">Tổng cộng</span>
                <span>{plan.buy_info.formatted_total}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="default" onClick={() => onBuy(plan.plan_id)} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Mua'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
