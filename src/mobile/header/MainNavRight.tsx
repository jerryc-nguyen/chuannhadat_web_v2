'use client';

import React from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
import Image from 'next/image';
import { Skeleton } from '@components/ui/skeleton';
import Link from 'next/link';
import { LucideBell, LucideHeart } from 'lucide-react';
import { cn } from '@common/utils';
type MainNavRightProps = {
  isLogged: boolean;
  handleRemoveToken: () => void;
  handleSetToken: (token: string) => void;
};
export default function MainNavRight({
  isLogged,
  handleRemoveToken,
  handleSetToken,
}: MainNavRightProps) {
  const { signOut, currentUser } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!isLogged) {
      signOut();
    }
  }, [isLogged]);
  const { openModal, closeModal } = useModals();
  const { openPanel } = useSidePanels();

  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: (
        <ModalSelectRegisterOrLogin handleSetTokenServer={handleSetToken} onClose={closeModal} />
      ),
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
  const handleRedirect = () => {
    return;
  };
  const handleLogOut = () => {
    handleRemoveToken();
    router.refresh();
  };
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);
  const renderAvatar = () => {
    return isLogged ? (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          {currentUser?.avatar_url ? (
            <Image
              alt={currentUser.full_name}
              width={40}
              height={40}
              className="rounded-full"
              src={currentUser.avatar_url}
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full bg-primary_color" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{currentUser?.full_name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/dashboard">Trang quản lý</Link>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/manage-post/collection-post">Quản lý tin đăng</Link>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/account-settings">Cài đặt tài khoản</Link>
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/top-up">Nạp tiền</Link>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
            Đăng xuất
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
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
    );
  };
  const renderNotification = () => {
    return (
      isLogged && (
        <div className="relative">
          <Button
            onClick={() => {
              showNotificationPanel();
            }}
            size={'icon'}
            variant={'outline'}
            className="rounded-full"
          >
            <LucideBell className="h-5 w-5" />
          </Button>

          <Badge
            className={cn(
              'absolute -right-1 top-0 ml-auto flex h-5 w-5 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-error_color hover:bg-error_color',
            )}
          >
            {total}
          </Badge>
        </div>
      )
    );
  };
  return (
    <div className="header-icon justify-betweens flex gap-x-2">
      {renderNotification()}
      <Button size={'icon'} variant="outline" className="rounded-full">
        <LucideHeart className="h-5 w-5" />
      </Button>
      {renderAvatar()}
      <div
        onClick={() => openMainnNavSidePanel()}
        className="mr-2 flex items-center justify-center rounded-full border p-2"
      >
        <LuMenu className="h-5 w-5" />
      </div>
    </div>
  );
}
