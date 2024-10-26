'use client';
import React from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@components/ui/button';
import { LucidePenSquare } from 'lucide-react';
import Link from 'next/link';
type MainNavRightProps = {
  isLogged: boolean;
};
import { getCookie, setFrontendToken } from '@common/cookies';
import { FRONTEND_TOKEN } from '@common/auth';
import FavoriteIcon from './FavoriteIcon';
import NotificationIcon from './NotificationIcon';
import AvatarIcon from './AvatarIcon';
import { usePaginatedNotifications } from '@hooks/usePaginatedNotifications';
export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { signOut, currentUser } = useAuth();
  const { loadMore } = usePaginatedNotifications();
  React.useEffect(() => {
    const hasFrontendToken = getCookie(FRONTEND_TOKEN);
    if (!hasFrontendToken) {
      setFrontendToken(uuidv4());
    }
  }, []);
  React.useEffect(() => {
    if (!isLogged) {
      signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);
  React.useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className="header-icon justify-betweens flex gap-x-2">
      <NotificationIcon isLogged={isLogged} />
      <FavoriteIcon />
      <AvatarIcon isLogged={isLogged} />
      <Link href="/tao-tin-moi" target="_blank">
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
    </div>
  );
}
