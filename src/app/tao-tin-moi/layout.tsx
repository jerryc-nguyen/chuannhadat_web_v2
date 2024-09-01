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
        <main className="h-full">
          <HeaderDashboard />
          {/* <div className={`${isMobile ? "" : "flex flex-1 flex-col"} gap-y-5 overflow-y-scroll rounded-md px-4 py-6 lg:px-8`}>
            {!isMobile && <Breadcrumb />}
            {children}
          </div> */}
          <div className='flex-1 space-y-4 p-8 pt-6'>
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="space-y-4">
              {children}
            </div>
          </div>
        </main>
      </section>
    </ThemeProvider>
  );
};

export default DashboardLayout;
