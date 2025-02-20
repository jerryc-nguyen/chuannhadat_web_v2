import { SummaryDashboard } from '@views/dashboard/summary';
import { Metadata } from 'next';
import React from 'react';

type DashboardPageProps = object;

export const metadata: Metadata = {
  title: 'Quản lý',
  description: 'Quản lý tài khoản',
};

const DashboardPage: React.FC<DashboardPageProps> = () => {
  return <SummaryDashboard />;
};

export default DashboardPage;
