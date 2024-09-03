import Breadcrumb from '@components/breadcrumb';
import { ThemeProvider } from '@components/providers';
import HeaderDashboard from '@desktop/dashboard/header';
import SidebarDashboard from '@desktop/dashboard/sidebar';
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
        <main className="flex h-screen flex-1 flex-col">
          <HeaderDashboard />
          <div
            className={`${isMobile ? '' : 'flex flex-1 flex-col'} gap-y-5 overflow-y-scroll bg-[#F5F6FA] p-8 dark:bg-slate-800`}
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
