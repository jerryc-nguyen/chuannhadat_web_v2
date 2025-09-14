'use client';
import React from 'react';
import { useAuth } from '@common/auth/AuthContext';
import { Button } from '@components/ui/button';
import { UserCircle } from 'lucide-react';
import NotificationIcon from './NotificationIcon';
import { Skeleton } from '@components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import ModalSelectRegisterOrLogin from '@frontend/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import MenubarIcon from './MenubarIcon';
import useResizeImage from '@common/hooks/useResizeImage';
import FavoriteIcon from '@frontend/features/main-nav-rights/FavoriteIcon/FavoriteIcon';

type MainNavRightProps = {
  isLogged: boolean;
};
const AVATAR_SIZE = 40;

export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { currentUser } = useAuth();
  const { openModal, closeModal } = useModals();
  const { cropSquare } = useResizeImage();

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
    if (isLogged || currentUser) {
      return currentUser?.avatar_url ? (
        <Link href={`/profile/${currentUser?.slug}`}>
          <Image
            alt={currentUser.full_name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="rounded-full"
            src={cropSquare(currentUser.avatar_url, AVATAR_SIZE)}
          />
        </Link>
      ) : (
        <Skeleton className="h-10 w-10 rounded-full bg-primary_color" />
      );
    } else {
      return (
        <Button
          onClick={showModalLoginAndRegister}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <UserCircle className="h-5 w-5" />
        </Button>
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
