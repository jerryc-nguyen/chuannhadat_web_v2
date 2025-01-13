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
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Skeleton } from '@components/ui/skeleton';
import useResizeImage from '@hooks/useResizeImage';
import useAuth from '@mobile/auth/hooks/useAuth';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { LuUserCircle } from 'react-icons/lu';

type AvatarIconProps = {
  isLogged: boolean;
};

const AvatarIcon: React.FC<AvatarIconProps> = ({ isLogged }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [openDropdownMenu, setOpenDropdownMenu] = React.useState(false);
  const isDashboardPage = pathName.includes('dashboard');
  const { currentUser, handleSignOut } = useAuth();
  const { openModal, closeModal } = useModals();
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams.get('hide_create_post') == 'true';
  const { buildThumbnailUrl } = useResizeImage();

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
  React.useEffect(() => {
    setOpenDropdownMenu(false);
  }, [pathName]);
  if (isLogged || currentUser)
    return (
      <DropdownMenu open={openDropdownMenu} onOpenChange={setOpenDropdownMenu}>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          {currentUser?.avatar_url ? (
            <Image
              alt={currentUser.full_name}
              width={40}
              height={40}
              className="rounded-full"
              src={buildThumbnailUrl({ imageUrl: currentUser.avatar_url, width: 40, ratio: 1 })}
              object-fit="cover"
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full bg-primary_color" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align={hideDangtinButton ? 'end' : 'center'}
          sideOffset={5}
        >
          {currentUser?.full_name && (
            <DropdownMenuLabel>{currentUser?.full_name}</DropdownMenuLabel>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={`/profile/${currentUser?.slug}`}>Trang cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={isDashboardPage ? '/' : '/dashboard'}>
                {isDashboardPage ? 'Trang chủ' : 'Trang quản lý'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href="/dashboard/manage-post/collection-post">Quản lý tin đăng</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href="/dashboard/account-settings">Cài đặt tài khoản</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href="/dashboard/top-up">Nạp tiền</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
            Đăng xuất
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
