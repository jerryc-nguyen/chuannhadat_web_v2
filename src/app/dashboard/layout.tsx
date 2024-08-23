import React from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return <>{children}</>;
};

export default DashboardLayout;
