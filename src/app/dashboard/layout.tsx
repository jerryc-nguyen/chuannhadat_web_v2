import React from 'react';
import { HeaderDashboard, SidebarDashboard } from '@desktop/dashboard/layout/components';
import './index.scss';
import { SidebarProvider } from '@components/ui/sidebar';
import Breadcrumb from '@components/breadcrumb';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <SidebarDashboard />
      <main className="flex h-screen w-full flex-1 flex-col">
        <HeaderDashboard />
        <Breadcrumb />
        <section className="flex flex-1 flex-col gap-y-5 overflow-y-auto bg-[#F5F6FA] p-4 dark:bg-slate-800 md:p-8 md:pt-0">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
