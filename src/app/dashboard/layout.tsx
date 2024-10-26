import { ThemeProvider } from '@components/providers';
import React from 'react';
import { MainDashboard, SidebarDashboard } from '@desktop/dashboard/layout/components';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import './index.scss';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <section className="grid min-h-screen w-full md:grid-cols-[301px_1fr] lg:grid-cols-[301px_1fr]">
        {!isMobile && <SidebarDashboard />}
        <MainDashboard>{children}</MainDashboard>
      </section>
    </ThemeProvider>
  );
};

export default DashboardLayout;
