'use client';

import React from 'react';
import { IoHeartOutline, IoNotificationsOutline } from 'react-icons/io5';
import useAuth from '@mobile/auth/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { LuMenu, LuUserCircle } from 'react-icons/lu';
import useModals from '@mobile/modals/hooks';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { Badge } from '@components/ui/badge';
import NotificationsList from '@desktop/notification/NotificationsList';
import useSidePanels from '@components/SidePanel/hooks';
import MainNavSidePanel from './MainNavSidePanel';

export default function MainNavRight() {
  const { signout, currentUser } = useAuth();
  const router = useRouter();

  const { openModal, closeModal } = useModals();
  const { openPanel } = useSidePanels();

  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };

  const openMainnNavSidePanel = () => {
    openPanel({
      side: 'right',
      content: <MainNavSidePanel />,
    });
  };

  const showNotificationPanel = () => {
    openPanel({
      side: 'right',
      content: (
        <NotificationsList
          notifications={notifications}
          total={total}
          onLoadMore={loadMore}
          onMarkReadAll={handleMarkReadAll}
          onRedirect={handleRedirect}
          onGetNotMarkRead={handleGetNotMarkRead}
        />
      ),
    });
  };

  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();

  const handleMarkReadAll = () => {
    return;
  };
  const handleRedirect = (id: number, is_read: boolean) => {
    return;
  };
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);

  return (
    <>
      {currentUser && (
        <span
          className="mr-2 flex items-center justify-center rounded-full border p-2"
          onClick={() => {
            showNotificationPanel();
          }}
        >
          <div className="relative">
            <IoNotificationsOutline className="h-5 w-5" />
            <Badge className="absolute right-[-15px] top-[-18px] ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
              {total}
            </Badge>
          </div>
        </span>
      )}

      <span className="mr-2 flex items-center justify-center rounded-full border p-2">
        <IoHeartOutline className="h-5 w-5" />
      </span>

      {currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="mr-2 flex items-center justify-center">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                height={36}
                width={36}
                className="rounded-full border"
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <a href="/dashboard">Trang quản lý</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signout();
                router.push('/');
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {!currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="mr-2 rounded-full"
              onClick={() => {
                showModalLoginAndRegister();
              }}
            >
              <LuUserCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      )}

      <div
        onClick={() => openMainnNavSidePanel()}
        className="mr-2 flex items-center justify-center rounded-full border p-2"
      >
        <LuMenu className="h-5 w-5" />
      </div>
    </>
  );
}
