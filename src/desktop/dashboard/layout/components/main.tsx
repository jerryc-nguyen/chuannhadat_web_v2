import React from 'react';
import HeaderDashboard from './header';
import { cn } from '@common/utils';

import Breadcrumb from '@components/breadcrumb';

type MainDashboardProps = {
  children: React.ReactNode;
};
const MainDashboard: React.FC<MainDashboardProps> = ({ children }) => {
  return (
    <main className={cn('flex h-screen flex-1 flex-col')}>
      <HeaderDashboard />
      <div
        className={
          'flex flex-1 flex-col gap-y-5 overflow-y-auto bg-[#F5F6FA] p-4 dark:bg-slate-800 md:p-8'
        }
      >
        <Breadcrumb />
        {children}
      </div>
    </main>
  );
};

export default MainDashboard;
