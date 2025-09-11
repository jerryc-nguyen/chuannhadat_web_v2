'use client';

import React from 'react';
import '@styles/pages/desktop/finacial-management/service-package.scss';

import { ServicePackageInfo } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@common/auth/AuthContext';
import { subscriptionApi } from '../../api/subscription';
import ServiceCard from '../components/ServiceCard';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import {
  breadcrumbAtom,
  defaultBreadcrumb,
  type IBreadcrumbItem,
} from '@dashboard/DashboardLayout/states/breadcrumbAtom';
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
      <h2 className="mb-4 text-2xl font-bold">Mua gói dịch vụ</h2>
      <h3 className="mb-2 text-lg font-bold">{currentServicePackage?.title}</h3>
      <p className="mb-0 text-gray-600">{currentServicePackage?.sub_title}</p>

      <Link
        href="/huong-dan-tu-dong-lam-moi"
        target="_blank"
        rel="noopener noreferrer"
        className="my-4 text-[#007bff]"
      >
        Xem hướng dẫn cài đặt tự động làm mới tin giúp bạn tiết kiệm thời gian
      </Link>
      <br />
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        {currentServicePackage &&
          currentServicePackage?.plans.map((plan) => (
            <ServiceCard key={plan.plan_id} plan={plan} />
          ))}
      </div>
    </div>
  );
};

export default ServicePackageView;
