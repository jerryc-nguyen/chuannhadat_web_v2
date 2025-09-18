import { useAuth } from '@common/auth/AuthContext';
import { Button } from '@components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet';
import ModalSelectRegisterOrLogin from '@frontend/features/auth/mobile/ModalSelectRegisterOrLogin';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { DASHBOARD_ROUTES } from '@common/router';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Menu, UserCircle } from 'lucide-react';

type MenubarIconProps = {
  isLogged: boolean;
};
const MenubarIcon: React.FC<MenubarIconProps> = ({ isLogged }) => {
  const [openMenuBar, setOpenMenuBar] = React.useState<boolean>(false);
  const pathName = usePathname() || '';
  const isDashboardPage = pathName.includes('dashboard');
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { openModal, closeModal } = useModals();
  const listMenubar = [
    {
      id: 0,
      href: isDashboardPage ? '/' : DASHBOARD_ROUTES.index,
      title: isDashboardPage ? 'Trang chủ' : 'Trang quản lý',
    },
    {
      id: 1,
      href: DASHBOARD_ROUTES.posts.index,
      title: 'Quản lý tin đăng',
    },
    {
      id: 2,
      href: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
    },
    {
      id: 4,
      href: DASHBOARD_ROUTES.balance.topup,
      title: 'Nạp tiền',
    },
  ];
  React.useEffect(() => {
    if (!currentUser && !isLogged) {
      setOpenMenuBar(false);
    }
  }, [currentUser, isLogged]);
  const handleLogout = () => {
    router.refresh();
    logout();
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const onRenderMenuWhenLogged = () => {
    return (
      <section>
        <div className="flex flex-col p-6">
          <SheetTitle className="font-bold text-primary_color">{currentUser?.full_name}</SheetTitle>
          <SheetDescription className="text-sm text-secondary">
            Mã thành viên: {currentUser?.id}
          </SheetDescription>
        </div>

        <div className="mb-4 px-6">
          <Button className="flex w-full items-center gap-x-2">
            <a href={DASHBOARD_ROUTES.posts.new}>Đăng tin</a>
          </Button>

          <Button className="mt-2 flex w-full items-center gap-x-2">
            <a href={DASHBOARD_ROUTES.balance.topup}>Nạp tiền</a>
          </Button>
        </div>

        <ul>
          {listMenubar.map((menu) => (
            <li
              className="border-b px-6 py-2 font-medium hover:bg-slate-100 hover:underline"
              key={menu.id}
            >
              <a href={menu.href} className="block w-full">
                {menu.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="my-4 px-6">
          <Button
            className="flex w-full items-center gap-x-2"
            variant="outline"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </section>
    );
  };
  const showModalLoginAndRegister = () => {
    setOpenMenuBar(false);
    openModal({
      name: 'loginAndRegister',
      content: <ModalSelectRegisterOrLogin onClose={closeModal} />,
      title: 'Đăng nhập / Đăng ký',
      maxHeightPercent: 0.9,
      btsContentWrapClass: 'mt-2 bg-white p-4',
    });
  };
  const onRenderMenuNotLoggin = () => {
    return (
      <section>
        <div className="flex items-center gap-x-2 px-6 pt-3">
          <UserCircle className="h-6 w-6" />
          <SheetTitle className="text-sm">Xin chào, quý khách</SheetTitle>
        </div>
        <div className="my-4 px-6">
          <Button className="flex w-full items-center gap-x-2" onClick={showModalLoginAndRegister}>
            Đăng nhập
          </Button>
        </div>
        <SheetDescription className="px-6 text-center text-sm font-medium">
          Bạn vui lòng đăng nhập để sử dụng đầy đủ dịch vụ.
        </SheetDescription>
      </section>
    );
  };
  return (
    <Sheet onOpenChange={setOpenMenuBar} open={openMenuBar}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenMenuBar(true)}
          className="mr-0 rounded-full !bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        {isLogged || currentUser ? onRenderMenuWhenLogged() : onRenderMenuNotLoggin()}
      </SheetContent>
    </Sheet>
  );
};

export default MenubarIcon;
