'use client';
import useAuth from '@mobile/auth/hooks/useAuth';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FRONTEND_TOKEN } from '@common/auth';
import { getCookie, setFrontendToken } from '@common/cookies';
import { Button } from '@components/ui/button';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import { LucideLogIn, LucidePenSquare } from 'lucide-react';
import Link from 'next/link';
import AvatarIcon from './AvatarIcon';
import FavoriteIcon from './FavoriteIcon';
import NotificationIcon from './NotificationIcon';
type MainNavRightProps = {
  isLogged: boolean;
};

export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { handleSignOut, currentUser } = useAuth();

  React.useEffect(() => {
    const hasFrontendToken = getCookie(FRONTEND_TOKEN);
    if (!hasFrontendToken) {
      setFrontendToken(uuidv4());
    }
  }, []);
  React.useEffect(() => {
    if (!isLogged) {
      handleSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  const { openModal, closeModal } = useModals();
  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      showAsDialog: true,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };

  return (
    <div className="header-icon justify-betweens flex gap-x-2">
      <NotificationIcon isLogged={isLogged} />
      <FavoriteIcon />
      <AvatarIcon isLogged={isLogged} />
      {currentUser ? (
        <Link
          href="/dashboard/manage-post/new-post"
          target="_blank"
        >
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
      ) : (
        <Button
          asChild
          className="text-md ml-2 hidden cursor-pointer items-center gap-x-2 rounded-md border bg-primary_color/80 px-6 py-2 font-medium text-white hover:bg-primary_color md:flex"
          onClick={showModalLoginAndRegister}
        >
          <span className="space-x-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <p>Đăng nhập</p>
            <LucideLogIn className="h-5 w-5" />
          </span>
        </Button>
      )}
    </div>
  );
}
