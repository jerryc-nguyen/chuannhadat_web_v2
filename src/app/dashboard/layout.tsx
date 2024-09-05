import { cn } from '@common/utils';
import Breadcrumb from '@components/breadcrumb';
import { ThemeProvider } from '@components/providers';
import HeaderDashboard from '@desktop/dashboard/header';
import SidebarDashboard from '@desktop/dashboard/sidebar';
import useCheckLoggedUser from '@hooks/useCheckLoggedUser';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import React from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <section className="grid min-h-screen w-full md:grid-cols-[301px_1fr] lg:grid-cols-[301px_1fr]">
        <SidebarDashboard />
        <main className={cn('flex flex-1 flex-col', isMobile ? '' : 'h-screen')}>
          <HeaderDashboard />
          <div
            className={`${isMobile ? '' : 'flex flex-col gap-y-5'} flex-1 overflow-y-auto bg-[#F5F6FA] p-4 dark:bg-slate-800 md:p-8`}
          >
            {!isMobile && <Breadcrumb />}
            {children}
          </div>
        </main>
      </section>
    </ThemeProvider>
  );
};

export default DashboardLayout;
