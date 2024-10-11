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
import { LuUserCircle } from 'react-icons/lu';
import useModals from '@mobile/modals/hooks';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Badge } from '@components/ui/badge';
import NotificationsList from '@desktop/notification/NotificationsList';
import { LucideBell, LucideHeart, LucidePenSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@components/ui/skeleton';
import { cn } from '@common/utils';
import { removeTokenServer } from '@app/action';
type MainNavRightProps = {
  isLogged: boolean;
};
export default function MainNavRight({ isLogged }: MainNavRightProps) {
  const { signOut, currentUser } = useAuth();
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
  const router = useRouter();
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
  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();
  const handleMarkReadAll = () => {
    return;
  };
  const handleRedirect = () => {
    return;
  };
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);
  const handleLogOut = () => {
    removeTokenServer();
    router.refresh();
  };

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
          {currentUser?.full_name && (
            <DropdownMenuLabel>{currentUser?.full_name}</DropdownMenuLabel>
          )}
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
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button size={'icon'} variant={'outline'} className="rounded-full">
                <LucideBell className="h-5 w-5" />
              </Button>

              <Badge
                className={cn(
                  'absolute -right-1 top-0 ml-auto flex h-5 w-5 shrink-0 -translate-y-1/2 items-center justify-center rounded-full hover:bg-error_color',
                  total ? 'bg-error_color' : 'bg-transparent',
                )}
              >
                {total ? (
                  total
                ) : (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary_color opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-primary_color" />
                  </span>
                )}
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent className="h-[520px] w-80">
            <NotificationsList
              notifications={notifications}
              total={total}
              onLoadMore={loadMore}
              onMarkReadAll={handleMarkReadAll}
              onRedirect={handleRedirect}
              onGetNotMarkRead={handleGetNotMarkRead}
            />
          </PopoverContent>
        </Popover>
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

      <Link href="/dashboard/manage-post/new-post" target="_blank">
        <Button asChild className="text-md ml-2 hidden items-center gap-x-2 rounded-md border bg-primary_color/80 px-6 py-2 font-medium text-white hover:bg-primary_color md:flex">
          <span className="bg-primary text-primary-foreground hover:bg-primary/90 space-x-2">
            <p>Đăng tin</p><LucidePenSquare className="h-5 w-5" />
          </span>
        </Button>
      </Link>
    </div>
  );
}
