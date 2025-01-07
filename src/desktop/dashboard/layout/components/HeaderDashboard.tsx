import { API_TOKEN_SERVER } from '@common/auth';
import { cn } from '@common/utils';
import { SidebarTrigger } from '@components/ui/sidebar';
import AvatarIcon from '@desktop/components/AvatarIcon';
import FavoriteIcon from '@desktop/components/FavoriteIcon';
import NotificationIcon from '@desktop/components/NotificationIcon';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import MainNavRight from '@mobile/header/MainNavRight';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import React from 'react';

const ButtonCreatePost = dynamic(async () => (await import('./ButtonCreatePost')).default, { ssr: false });

type HeaderDashboardProps = object;

const HeaderDashboard: React.FC<HeaderDashboardProps> = () => {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  const { isMobile } = useGetUserAgentInfo();
  return (
    <header className={cn("box-border flex h-[70px] items-center justify-between gap-4 border-b px-4 py-4 lg:px-6 bg-white", "sticky top-0 z-10 ")}>
      <SidebarTrigger />
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
