'use client';

import { ThemeProvider } from '@components/providers';
import React from 'react';
import useCheckLoggedUser from '@hooks/useCheckLoggedUser';
import { MainDashboard, SidebarDashboard } from '@desktop/dashboard/layout/components';
import { useSSROptionsContext } from '@components/providers/SSROptionsProvider';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  useCheckLoggedUser();
  const { isMobile } = useSSROptionsContext();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {isMobile && <MainDashboard>{children}</MainDashboard>}
      {!isMobile && (
        <section className="grid min-h-screen w-full md:grid-cols-[301px_1fr] lg:grid-cols-[301px_1fr]">
          <SidebarDashboard />
          <MainDashboard>{children}</MainDashboard>
        </section>)
      }

    </ThemeProvider>
  );
};

export default DashboardLayout;
