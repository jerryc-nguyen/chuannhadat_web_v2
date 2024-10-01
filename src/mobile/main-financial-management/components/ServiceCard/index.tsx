import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuyButton, PaymentDialog } from '../PaymentDialog';
import { services } from '@api/services';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Service } from '@mobile/main-financial-management/types';
import useModals from '@mobile/modals/hooks';
import '@styles/pages/mobile/finacial-management/service-package.scss';

interface ServiceCardProps {
  plan: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ plan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal, closeModal } = useModals();

  const buyPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      return await services.subscription_plans.buySubscriptionPlans(planId);
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || 'Mua gói thành công!');

        closeModal()
      } else toast.error(data.message || 'Số tiền trong tài khoản không đủ!');
    },
    onError: (error: any) => {
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
        ? openModal({
          name: plan.plan_name,
          title: plan.plan_name,
          content: <PaymentDialog plan={plan} onBuy={handleBuy} isLoading={isLoading} />,
          footer: <BuyButton plan={plan} onBuy={handleBuy} isLoading={isLoading} />,
          maxHeightPercent: 0.8,
          isHiddenScroll: true
        })
        : toast.error(data.message || 'Số tiền trong tài khoản không đủ!');
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    },
  });

  const handleBuyNowClick = (planId: number) => 
    buyPlanValidatorMutation.mutate(planId); // Call the mutation and pass planId as variable
    

  const handleBuy = (planId: number) => {
    setIsLoading(true);
    buyPlanMutation.mutate(planId); // Call the mutation and pass planId as variable
  };

  return (
    <>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{plan.plan_name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <img
            src={plan.image_url}
            alt={plan.plan_name}
            className="h-40 w-full rounded object-contain"
          />
          <p className="text-sm text-gray-500">GIÁ: {plan.buy_info.formatted_total} / 1 THÁNG</p>
          <p className="text-sm text-gray-500">
            BAO GỒM:
            <div>
              {plan.contents.map((content, index) => (
                <p key={index} className="mt-2 text-lg text-[#212529]">
                  + {content.text}: <strong>{content.value}</strong>
                </p>
              ))}
            </div>
          </p>
        </CardContent>

        <CardFooter>
          <Button variant="default" className="w-full" onClick={()=>handleBuyNowClick(plan.plan_id)}>
            Mua ngay
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ServiceCard;
