'use client';
import { useAuth } from '@common/auth/AuthContext';

import { Button } from '@components/ui/button';
import ModalSelectRegisterOrLogin from '@frontend/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { LucideLogIn, LucidePenSquare } from 'lucide-react';
import Link from 'next/link';
import AvatarIcon from './AvatarIcon';
import FavoriteIcon from '@frontend/features/main-nav-rights/FavoriteIcon/FavoriteIcon';
import NotificationIcon from './NotificationIcon';
import { DASHBOARD_ROUTES } from '@common/router';
type MainNavRightProps = {
  isLogged: boolean;
};

export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { currentUser } = useAuth();
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
        <Link href={DASHBOARD_ROUTES.posts.new} target="_blank">
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
          data-testid="showLoginModalBtn"
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
