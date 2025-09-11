import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalanceRequest } from '@common/api/balance';
import { subscriptionApi } from '@dashboard/FinancialManagement/api/subscription';
import { Service } from '../../types';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import '@styles/pages/mobile/finacial-management/service-package.scss';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { BuyButton, PaymentDialog } from '../PaymentDialog';

interface ServiceCardProps {
  plan: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ plan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal } = useModals();
  const { fetchBalance } = useBalanceRequest();

  const buyPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      return await subscriptionApi.buySubscriptionPlans(planId);
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || 'Mua gói thành công!');
        fetchBalance();
        closeModal();
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
      return await subscriptionApi.validateBuySubscriptionPlans(planId);
    },
    onSuccess: (data) => {
      data.status
        ? openModal({
          name: plan.plan_name,
          title: plan.plan_name,
          content: <PaymentDialog plan={plan} onBuy={handleBuy} isLoading={isLoading} />,
          footer: <BuyButton plan={plan} onBuy={handleBuy} isLoading={isLoading} />,
          maxHeightPercent: 0.5,
          isHiddenScroll: true,
        })
        : toast.error(data.message || 'Số tiền trong tài khoản không đủ!');
    },
    onError: (error: A) => {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleBuyNowClick = (planId: number) => buyPlanValidatorMutation.mutate(planId); // Call the mutation and pass planId as variable

  const handleBuy = (planId: number) => {
    setIsLoading(true);
    buyPlanMutation.mutate(planId); // Call the mutation and pass planId as variable
  };

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>{plan.plan_name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="mb-4 font-bold">{plan.buy_info.formatted_total} / 1 THÁNG</p>
          <p>
            <div>
              {plan.contents.map((content, index) => (
                <p key={index} className="mt-2 text-lg">
                  <span className="text-secondary">{content.text}:</span>{' '}
                  <strong>{content.value}</strong>
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
    </>
  );
};

export default ServiceCard;
