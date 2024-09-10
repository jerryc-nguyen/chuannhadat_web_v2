'use client';
import React from 'react';
import HeaderDashboard from './header';
import { cn } from '@common/utils';
import { useSSROptionsContext } from '@components/providers/SSROptionsProvider';
import Breadcrumb from '@components/breadcrumb';

type MainDashboardProps = {
  children: React.ReactNode;
};
const MainDashboard: React.FC<MainDashboardProps> = ({ children }) => {
  const { isMobile } = useSSROptionsContext();
  return (
    <main className={cn('flex flex-1 flex-col', isMobile ? '' : 'h-screen')}>
      <HeaderDashboard />
      <div
        className={`${isMobile ? '' : 'flex flex-col gap-y-5'} flex-1 overflow-y-auto bg-[#F5F6FA] p-4 dark:bg-slate-800 md:p-8`}
      >
        {!isMobile && <Breadcrumb />}
        {children}
      </div>
    </main>
  );
};

export default MainDashboard;
