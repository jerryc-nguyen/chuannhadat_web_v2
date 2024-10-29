'use client';
import React from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@components/ui/button';
import { LuUserCircle } from 'react-icons/lu';
import { getCookie, setFrontendToken } from '@common/cookies';
import { FRONTEND_TOKEN } from '@common/auth';
import FavoriteIcon from './FavoriteIcon';
import NotificationIcon from './NotificationIcon';
import { Skeleton } from '@components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import MenubarIcon from './MenubarIcon';
type MainNavRightProps = {
  isLogged: boolean;
};
export default function MainNavRight({ isLogged }: MainNavRightProps) {
  console.log('🚀 ~ MainNavRight ~ isLogged:', isLogged);
  const { signOut, currentUser } = useAuth();
  const { openModal, closeModal } = useModals();
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

  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };
  const renderAvatarIcon = () => {
    if (!isLogged) {
      return (
        <Button
          onClick={showModalLoginAndRegister}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <LuUserCircle className="h-5 w-5" />
        </Button>
      );
    } else {
      return currentUser?.avatar_url ? (
        <Link href={`/profile/${currentUser?.slug}`}>
          <Image
            alt={currentUser.full_name}
            width={40}
            height={40}
            className="rounded-full"
            src={currentUser.avatar_url}
          />
        </Link>
      ) : (
        <Skeleton className="h-10 w-10 rounded-full bg-primary_color" />
      );
    }
  };

  return (
    <div className="header-icon justify-betweens flex gap-x-2">
      <NotificationIcon isLogged={isLogged} />
      <FavoriteIcon />
      {renderAvatarIcon()}
      <MenubarIcon isLogged={isLogged} />
    </div>
  );
}
