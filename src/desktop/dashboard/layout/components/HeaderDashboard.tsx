import { API_TOKEN_SERVER } from '@common/auth';
import Breadcrumb from '@components/breadcrumb';
import { SidebarTrigger } from '@components/ui/sidebar';
import AvatarIcon from '@desktop/components/AvatarIcon';
import FavoriteIcon from '@desktop/components/FavoriteIcon';
import NotificationIcon from '@desktop/components/NotificationIcon';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import MainNavRight from '@mobile/header/MainNavRight';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import React from 'react';

const ButtonCreatePost = dynamic(async () => (await import('./ButtonCreatePost')).default, {
  ssr: false,
});

type HeaderDashboardProps = object;

const HeaderDashboard: React.FC<HeaderDashboardProps> = () => {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  const { isMobile } = useGetUserAgentInfo();
  return (
    <header className="box-border flex h-[70px] items-center justify-between gap-4 border-b bg-muted/40 px-4 py-2 lg:px-6 sticky top-0 bg-white z-10">
      <div className="flex items-center gap-x-4">
        {isMobile && <SidebarTrigger />}
        {!isMobile && <Breadcrumb />}
      </div>

      {isMobile ? (
        <MainNavRight isLogged={isLogged} />
      ) : (
        <section className="flex items-center gap-x-2">
          <NotificationIcon isLogged={isLogged} />
          <FavoriteIcon />
          <AvatarIcon isLogged={isLogged} />
          <ButtonCreatePost />
        </section>
      )}
    </header>
  );
};

export default HeaderDashboard;
