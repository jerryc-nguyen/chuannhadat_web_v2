import { removeTokenServer } from '@app/action';
import { Button } from '@components/ui/button';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import { LuUserCircle } from 'react-icons/lu';
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
import Image from 'next/image';
import useAuth from '@mobile/auth/hooks/useAuth';
import { Skeleton } from '@components/ui/skeleton';
import Link from 'next/link';
type AvatarIconProps = {
  isLogged: boolean;
};

const AvatarIcon: React.FC<AvatarIconProps> = ({ isLogged }) => {
  const { openModal, closeModal } = useModals();
  const { currentUser } = useAuth();
  const router = useRouter();
  const handleLogOut = () => {
    removeTokenServer();
    router.refresh();
  };
  const showModalLoginAndRegister = () => {
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };
  if (!isLogged)
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
  );
};

export default AvatarIcon;
