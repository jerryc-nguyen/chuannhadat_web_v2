import React from 'react';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
import { SidebarTrigger } from '@components/ui/sidebar';
import NotificationIcon from '@desktop/components/NotificationIcon';
import FavoriteIcon from '@desktop/components/FavoriteIcon';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { LucidePenSquare } from 'lucide-react';
import AvatarIcon from '@desktop/components/AvatarIcon';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import MainNavRight from '@mobile/header/MainNavRight';
type HeaderDashboardProps = object;

const HeaderDashboard: React.FC<HeaderDashboardProps> = () => {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  const { isMobile } = useGetUserAgentInfo();
  return (
    <header className="box-border flex h-[70px] items-center justify-between gap-4 border-b bg-muted/40 px-4 py-2 lg:px-6">
      <SidebarTrigger />
      {isMobile ? (
        <MainNavRight isLogged={isLogged} />
      ) : (
        <section className="flex items-center gap-x-2">
          <NotificationIcon isLogged={isLogged} />
          <FavoriteIcon />
          <AvatarIcon isLogged={isLogged} />
          <Link href="/dashboard/manage-post/new-post" target="_blank">
            <Button
              asChild
              className="text-md ml-2 hidden items-center gap-x-2 rounded-md border bg-primary_color/80 px-6 py-2 font-medium text-white hover:bg-primary_color md:flex"
            >
              <span className="space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <p>Đăng tin</p>
                <LucidePenSquare className="h-5 w-5" />
              </span>
            </Button>
          </Link>
        </section>
      )}
    </header>
  );
};

export default HeaderDashboard;
