'use client';

import React from 'react';
import '@styles/pages/desktop/finacial-management/service-package.scss';

import { ServicePackageInfo } from '../types';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@mobile/auth/hooks/useAuth';
import { services } from '@api/services';
import ServiceCard from '../components/ServiceCard';
import { Button } from '@components/ui/button';

const ServicePackageView = () => {
  const { currentUser } = useAuth();
  const [currentServicePackage, setCurrentServicePackage] = React.useState<ServicePackageInfo>();

  const { data } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () =>
      currentUser ? services.subscription_plans.getSubscriptionPlans() : Promise.resolve(null),
    enabled: !!currentUser,
    staleTime: 300000,
  });

  React.useEffect(() => {
    data && setCurrentServicePackage(data?.data[0]);
  }, [data]);

  return (
    <div>
      <h3 className="mb-4 mt-8 text-xl font-bold">Mua gói dịch vụ</h3>

      <div className=" mx-auto px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold">{currentServicePackage?.title}</h1>
        <p className="text-gray-600 mb-0">{currentServicePackage?.sub_title}</p>
        <a href="https://chuannhadat.com/huong-dan-tu-dong-lam-moi" target="_blank" rel="noopener noreferrer">
          <Button variant="link" className='mb-8 text-[#007bff] pl-0'> {'>>'} Xem hướng dẫn cài đặt tự động làm mới tin giúp bạn tiết kiệm thời gian</Button>
        </a>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {currentServicePackage &&
            currentServicePackage?.plans.map((plan) => (
              <ServiceCard key={plan.plan_id} plan={plan} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePackageView;
