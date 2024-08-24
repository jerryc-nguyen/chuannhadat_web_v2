import { Metadata } from 'next';
import React from 'react';

type DashboardPageProps = object;
export const metadata: Metadata = {
  title: 'Quản lý',
  description: 'Quản lý tài khoản',
};
const DashboardPage: React.FC<DashboardPageProps> = () => {
  return <div className="text-">DashboardPage</div>;
};

export default DashboardPage;
