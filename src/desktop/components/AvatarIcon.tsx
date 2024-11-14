'use client';
import { removeTokenServer } from '@app/action';
import { Button } from '@components/ui/button';
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
import { Skeleton } from '@components/ui/skeleton';
import useAuth from '@mobile/auth/hooks/useAuth';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { LuUserCircle } from 'react-icons/lu';

type AvatarIconProps = {
  isLogged: boolean;
};

const AvatarIcon: React.FC<AvatarIconProps> = ({ isLogged }) => {
  const router = useRouter();
  const pathName = usePathname();
  const isDashboardPage = pathName.includes('dashboard');
  const { currentUser, handleSignOut } = useAuth();
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

  const handleLogOut = () => {
    removeTokenServer();
    router.refresh();
  };
  React.useEffect(() => {
    if (!isLogged) {
      handleSignOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);
  if (isLogged || currentUser)
    return (
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
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={`/profile/${currentUser?.slug}`}>Trang cá nhân</Link>
              <DropdownMenuShortcut>⇧⌘R</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={isDashboardPage ? '/' : '/dashboard'}>
                {isDashboardPage ? 'Trang chủ' : 'Trang quản lý'}
              </Link>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href="/dashboard/manage-post/collection-post">Quản lý tin đăng</Link>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href="/dashboard/account-settings">Cài đặt tài khoản</Link>
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
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
    );
  return (
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

export default AvatarIcon;
