import React from 'react';
import { HeaderDashboard, SidebarDashboard } from '@desktop/dashboard/layout/components';
import './index.scss';
import { SidebarProvider } from '@components/ui/sidebar';
import Breadcrumb from '@components/breadcrumb';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isMobile } = useGetUserAgentInfo();
  return (
    <SidebarProvider>
      <SidebarDashboard />
      <main className="flex h-screen w-full flex-1 flex-col">
        <HeaderDashboard />
        {isMobile && <Breadcrumb />}
        <section className="flex flex-1 flex-col gap-y-5 overflow-y-auto bg-[#F5F6FA] p-4 pt-0 dark:bg-slate-800 md:pt-6 lg:p-6">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
