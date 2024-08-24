import HeaderDashboard from '@desktop/dashboard/header';
import SidebarDashboard from '@desktop/dashboard/sidebar';
import React from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[301px_1fr] lg:grid-cols-[301px_1fr]">
      <SidebarDashboard />
      <main className="flex flex-1 flex-col">
        <HeaderDashboard />
        <div className="overflow-hidden rounded-md p-4">
          {children}
        </div>
      </main>
    </section>
  );
};

export default DashboardLayout;
