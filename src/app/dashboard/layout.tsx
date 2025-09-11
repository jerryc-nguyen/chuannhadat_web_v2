import { getUserAgentInfo } from '@common/getUserAgentInfo';
import Breadcrumb from '@components/breadcrumb';
import { HeaderDashboard, SidebarDashboard } from '@dashboard/DashboardLayout/components';
import React, { Suspense } from 'react';
import { DynamicSidebarProvider, SidebarLoader } from '@components/ui/dynamic';
import './index.scss';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({ children }) => {
  const { isMobile } = await getUserAgentInfo();
  return (
    <Suspense fallback={<SidebarLoader />}>
      <DynamicSidebarProvider>
        <SidebarDashboard />
        <main className="flex min-h-screen w-full flex-1 flex-col">
          <HeaderDashboard />
          {isMobile && <Breadcrumb />}
          <section className="flex flex-1 flex-col gap-y-5 overflow-y-auto bg-[#F5F6FA] p-0 pt-0 dark:bg-slate-800 md:pt-6 lg:p-6">
            {children}
          </section>
        </main>
      </DynamicSidebarProvider>
    </Suspense>
  );
};

export default DashboardLayout;
