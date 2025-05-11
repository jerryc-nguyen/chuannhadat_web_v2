import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '../../types';
import PaymentDialog from '../PaymentDialog';
import { services } from '@api/services';
import { useMutation } from '@tanstack/react-query';
import { useBalanceRequest } from '@api/balance';
import { toast } from 'sonner';

interface ServiceCardProps {
  plan: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ plan }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBalance } = useBalanceRequest();

  const buyPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      return await services.subscription_plans.buySubscriptionPlans(planId);
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || 'Mua gói thành công!');
        fetchBalance();
        handleCloseDialog();
      } else toast.error(data.message || 'Số tiền trong tài khoản không đủ!');
    },
    onError: (error: A) => {
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const buyPlanValidatorMutation = useMutation({
    mutationFn: async (planId: number) => {
      return await services.subscription_plans.validateBuySubscriptionPlans(planId);
    },
    onSuccess: (data) => {
      data.status
        ? setDialogOpen(true)
        : toast.error(data.message || 'Số tiền trong tài khoản không đủ!');
    },
    onError: (error: A) => {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleBuyNowClick = (planId: number) => {
    buyPlanValidatorMutation.mutate(planId);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleBuy = (planId: number) => {
    setIsLoading(true);
    buyPlanMutation.mutate(planId); // Call the mutation and pass planId as variable
  };

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="font-semibold">{plan.plan_name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className='font-bold mb-4'>{plan.buy_info.formatted_total} / 1 THÁNG</p>
          <p>
            <div>
              {plan.contents.map((content, index) => (
                <p key={index} className="mt-2 text-lg">
                  <span className='text-secondary'>{content.text}:</span> <strong>{content.value}</strong>
                </p>
              ))}
            </div>
          </p>
        </CardContent>

        <CardFooter>
          <Button
            variant="default"
            className="w-full"
            onClick={() => handleBuyNowClick(plan.plan_id)}
          >
            Mua ngay
          </Button>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <PaymentDialog
          plan={plan}
          isLoading={isLoading}
          onClose={handleCloseDialog}
          onBuy={() => handleBuy(plan.plan_id)} // Pass plan.plan_id to handleBuy
        />
      )}
    </>
  );
};

export default ServiceCard;
