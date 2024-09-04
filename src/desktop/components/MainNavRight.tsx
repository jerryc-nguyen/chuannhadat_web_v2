'use client';
import { Icon } from 'konsta/react';
import React from 'react';
import { IoHeartOutline, IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';

import useAuth from '@mobile/auth/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import { LuUserCircle } from 'react-icons/lu';
import useModals from '@mobile/modals/hooks';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { Popover, PopoverTrigger } from '@components/ui/popover';
import { Badge } from '@components/ui/badge';
import NotificationsList from '@desktop/notification/NotificationsList';

export default function MainNavRight() {
  const { signout, currentUser } = useAuth();
  const router = useRouter();

  const { openModal, closeModal } = useModals();

  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
    });
  };

  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();

  const handleMarkReadAll = () => {};
  const handleRedirect = (id: number, is_read: boolean) => {};
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);

  return (
    <>
      {currentUser && (
        <span className="mr-2 flex items-center justify-center rounded-full border p-2">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <IoNotificationsOutline className="h-5 w-5" />
                <Badge className="absolute right-[-15px] top-[-18px] ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
                  {total}
                </Badge>
              </div>
            </PopoverTrigger>
            <NotificationsList
              notifications={notifications}
              total={total}
              onLoadMore={loadMore}
              onMarkReadAll={handleMarkReadAll}
              onRedirect={handleRedirect}
              onGetNotMarkRead={handleGetNotMarkRead}
            />
          </Popover>
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
              className="rounded-full"
              onClick={() => {
                showModalLoginAndRegister();
              }}
            >
              <LuUserCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      )}
    </>
  );
}
