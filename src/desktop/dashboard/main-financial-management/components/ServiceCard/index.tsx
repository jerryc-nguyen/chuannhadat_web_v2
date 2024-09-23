import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { Service } from '../../types';
import SubscriptionDialog from '../SubscriptionDialog'; 

interface ServiceCardProps {
  plan: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ plan }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleBuyNowClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
            className="w-full h-40 object-contain rounded"
          />
          <p className="text-sm text-gray-500">
            GIÁ: {plan.buy_info.formatted_total} / 1 THÁNG
          </p>
          <p className="text-sm text-gray-500">
            BAO GỒM: 
            <div>
            {plan.contents.map((content, index) => (
              <p key={index} className="text-lg text-[#212529] mt-2">+ {content.text}: <strong>{content.value}</strong></p>
            ))}
            </div>
          </p>
        </CardContent>

        <CardFooter>
          <Button variant="default" className="w-full" onClick={handleBuyNowClick}>
            Mua ngay
          </Button>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <SubscriptionDialog
          plan={plan}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
};

export default ServiceCard;
