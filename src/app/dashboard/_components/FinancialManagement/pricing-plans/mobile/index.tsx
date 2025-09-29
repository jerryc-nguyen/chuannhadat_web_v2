'use client';

import React from 'react';
import '@styles/pages/desktop/finacial-management/service-package.scss';

import { ServicePackageInfo } from '@dashboard/FinancialManagement/types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@common/auth/AuthContext';
import { subscriptionApi } from '../../api/subscription';
import ServiceCard from './ServiceCard';
import MobileContainer from '../../components/MobileContainer';
import Link from 'next/link';
import { usePricingPlansBreadcrumb } from '@dashboard/FinancialManagement/hooks';
const ServicePackageView = () => {
  const { currentUser } = useAuth();
  const [currentServicePackage, setCurrentServicePackage] = React.useState<ServicePackageInfo>();

  const { data } = useQuery({
    queryKey: ['subscriptionPlans', currentUser],
    queryFn: () =>
      currentUser ? subscriptionApi.getSubscriptionPlans() : Promise.resolve(null),
    enabled: !!currentUser,
    staleTime: 300000,
  });

  React.useEffect(() => {
    data && setCurrentServicePackage(data?.data[0]);
  }, [data]);

  // Initialize breadcrumb
  usePricingPlansBreadcrumb();
  return (
    <MobileContainer>
      <div className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Mua gói dịch vụ</h2>
          <h3 className="mb-2 text-lg font-bold">{currentServicePackage?.title}</h3>
          <p className="mb-4 text-gray-600">{currentServicePackage?.sub_title}</p>

          <Link
            href="/huong-dan-tu-dong-lam-moi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007bff] underline"
          >
            Xem hướng dẫn cài đặt tự động làm mới tin giúp bạn tiết kiệm thời gian
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentServicePackage &&
            currentServicePackage?.plans.map((plan) => (
              <ServiceCard key={plan.plan_id} plan={plan} />
            ))}
        </div>
      </div>
    </MobileContainer>
  );
};

export default ServicePackageView;
