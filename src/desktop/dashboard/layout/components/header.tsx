import React from 'react';

import MainNavRight from '@desktop/components/MainNavRight';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
type HeaderDashboardProps = object;

const HeaderDashboard: React.FC<HeaderDashboardProps> = () => {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  return (
    <header className="box-content flex h-16 items-center gap-4 border-b bg-muted/40 px-4 py-2 lg:px-6">
      <MainNavRight isLogged={isLogged} />
    </header>
  );
};

export default HeaderDashboard;
