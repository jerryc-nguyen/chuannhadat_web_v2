'use client';
import React from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@components/ui/button';
import { LuMenu } from 'react-icons/lu';
import useSidePanels from '@components/SidePanel/hooks';
import MainNavSidePanel from './MainNavSidePanel';
import { getCookie, setFrontendToken } from '@common/cookies';
import { FRONTEND_TOKEN } from '@common/auth';
import FavoriteIcon from './FavoriteIcon';
import NotificationIcon from './NotificationIcon';
import AvatarIcon from './AvatarIcon';
type MainNavRightProps = {
  isLogged: boolean;
};
export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { signOut } = useAuth();
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
  const { openPanel } = useSidePanels();
  const openMainnNavSidePanel = () => {
    openPanel({
      side: 'right',
      content: <MainNavSidePanel />,
    });
  };

  return (
    <div className="header-icon justify-betweens flex gap-x-2">
      <NotificationIcon isLogged={isLogged} />
      <FavoriteIcon />
      <AvatarIcon isLogged={isLogged} />
      <Button
        variant="outline"
        size="icon"
        onClick={() => openMainnNavSidePanel()}
        className="mr-2 rounded-full !bg-white"
      >
        <LuMenu className="h-5 w-5" />
      </Button>
    </div>
  );
}
