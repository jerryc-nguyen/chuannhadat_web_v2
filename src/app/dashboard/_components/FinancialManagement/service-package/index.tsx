'use client';
import React from 'react';
import '@styles/pages/desktop/finacial-management/service-package.scss';
import { ServicePackageInfo } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@common/auth/AuthContext';
import { services } from '@api/services';
import ServiceCard from '../components/ServiceCard';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useSetAtom } from 'jotai';

const ServicePackageView = () => {
  const { currentUser } = useAuth();
  const [currentServicePackage, setCurrentServicePackage] = React.useState<ServicePackageInfo>();

  const { data } = useQuery({
    queryKey: ['subscriptionPlans', currentUser],
    queryFn: () =>
      currentUser ? services.subscription_plans.getSubscriptionPlans() : Promise.resolve(null),
    enabled: !!currentUser,
    staleTime: 300000,
  });

  React.useEffect(() => {
    data && setCurrentServicePackage(data?.data[0]);
  }, [data]);
  const setBreadCrumb = useSetAtom(breadcrumbAtom);
  React.useEffect(() => {
    const currentBreadCrumn: IBreadcrumbItem[] = [
      {
        link: '/service-package',
        title: 'Mua gói dịch vụ',
        isActive: true,
      },
    ];
    setBreadCrumb((state) => [...state, ...currentBreadCrumn]);
    return () => {
      setBreadCrumb(defaultBreadcrumb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Mua gói dịch vụ</h3>
      <div className="pb-4">
        <h1 className="mb-2 break-words text-xl font-bold">{currentServicePackage?.title}</h1>
        <p className="mb-0 whitespace-normal break-words text-gray-600">
          {currentServicePackage?.sub_title}
        </p>
        <Link href="/huong-dan-tu-dong-lam-moi" target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="mb-8 pl-0 text-[#007bff]">
            {'>>'} Xem hướng dẫn cài đặt tự động làm mới tin giúp bạn tiết kiệm thời gian
          </Button>
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-6">
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
