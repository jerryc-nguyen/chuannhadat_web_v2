'use client';
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
import useResizeImage from '@common/hooks/useResizeImage';
import { useAuth } from '@common/auth/AuthContext';
import ModalSelectRegisterOrLogin from '@frontend/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { UserCircle } from 'lucide-react';
import { DASHBOARD_ROUTES } from '@common/router';

type AvatarIconProps = {
  isLogged: boolean;
};

const AvatarIcon: React.FC<AvatarIconProps> = ({ isLogged }) => {
  const router = useRouter();
  const pathName = usePathname() || '';
  const [openDropdownMenu, setOpenDropdownMenu] = React.useState(false);
  const isDashboardPage = pathName.includes('dashboard');
  const { currentUser, logout } = useAuth();
  const { openModal, closeModal } = useModals();
  const searchParams = useSearchParams();
  const hideDangtinButton = searchParams?.get('hide_create_post') == 'true';
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
    logout();
    router.refresh();
    setTimeout(() => {
      router.push('/');
    }, 500);
  };


  React.useEffect(() => {
    setOpenDropdownMenu(false);
  }, [pathName]);
  if (isLogged || currentUser)
    return (
      <DropdownMenu open={openDropdownMenu} onOpenChange={setOpenDropdownMenu}>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          <button type="button" aria-label={`Menu tài khoản của ${currentUser?.full_name || 'người dùng'}`}>
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
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          side="bottom"
          align={hideDangtinButton ? 'end' : 'center'}
          sideOffset={5}
        >
          {currentUser?.full_name && (
            <>
              <DropdownMenuLabel>{currentUser?.full_name}</DropdownMenuLabel>

              <p className="px-2 text-xs text-secondary">Mã thành viên: {currentUser?.id}</p>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={`/profile/${currentUser?.slug}`} className="w-full">
                Trang cá nhân
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={isDashboardPage ? '/' : DASHBOARD_ROUTES.index} className="w-full">
                {isDashboardPage ? 'Trang chủ' : 'Trang quản lý'}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={DASHBOARD_ROUTES.posts.index} className="w-full">
                Quản lý tin đăng
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={DASHBOARD_ROUTES.profile.accountSettings} className="w-full">
                Cài đặt tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Link href={DASHBOARD_ROUTES.balance.topup} className="w-full">
                Nạp tiền
              </Link>
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
      aria-label="Đăng nhập hoặc đăng ký"
      onClick={() => {
        showModalLoginAndRegister();
      }}
    >
      <UserCircle className="h-5 w-5" />
    </Button>
  );
};

export default AvatarIcon;
