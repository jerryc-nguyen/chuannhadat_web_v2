import { removeTokenServer } from '@app/action';
import { Button } from '@components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import useAuth from '@mobile/auth/hooks/useAuth';
import ModalSelectRegisterOrLogin from '@mobile/auth/ModalSelectRegisterOrLogin';
import useModals from '@mobile/modals/hooks';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { LuMenu, LuUserCircle } from 'react-icons/lu';

const listMenubar = [
  {
    id: 0,
    href: '/dashboard',
    title: 'Trang quản lý',
  },
  {
    id: 1,
    href: '/dashboard/manage-post/collection-post',
    title: 'Quản lý tin đăng',
  },
  {
    id: 2,
    href: '/dashboard/account-setting',
    title: 'Cài đặt tài khoản',
  },
  {
    id: 3,
    href: '/tao-tin-moi',
    title: 'Đăng tin',
  },
  {
    id: 4,
    href: '/dashboard/top-up',
    title: 'Nạp tiền',
  },
];
type MenubarIconProps = {
  isLogged: boolean;
};
const MenubarIcon: React.FC<MenubarIconProps> = ({ isLogged }) => {
  const [openMenuBar, setOpenMenuBar] = React.useState<boolean>(false);
  const { currentUser, signOut } = useAuth();
  const router = useRouter();
  const { openModal, closeModal } = useModals();
  React.useEffect(() => {
    if (!currentUser && !isLogged) {
      setOpenMenuBar(false);
    }
  }, [currentUser, isLogged]);
  const handleLogout = () => {
    signOut();
    removeTokenServer();
    router.refresh();
  };
  const onRenderMenuWhenLogged = () => {
    return (
      <section>
        <div className="flex flex-col p-6">
          <h2 className="font-bold text-primary_color">{currentUser?.full_name}</h2>
          <span className="text-sm text-muted-foreground">ID {currentUser?.id}</span>
        </div>
        <ul>
          {listMenubar.map((menu) => (
            <li
              className="border-b px-6 py-2 font-medium hover:bg-slate-100 hover:underline"
              key={menu.id}
            >
              <Link href={menu.href}>{menu.title}</Link>
            </li>
          ))}
        </ul>
        <div className="my-4 px-6">
          <Button className="flex w-full items-center gap-x-2" onClick={handleLogout}>
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
          <LuUserCircle className="h-6 w-6" />
          <span>Xin chào, quý khách</span>
        </div>
        <div className="my-4 px-6">
          <Button
            className="mb-2 flex w-full items-center gap-x-2"
            onClick={() => router.push('tao-tin-moi')}
          >
            Đăng tin
          </Button>
          <Button className="flex w-full items-center gap-x-2" onClick={showModalLoginAndRegister}>
            Đăng nhập
          </Button>
        </div>
        <p className="px-6 text-center text-sm font-medium">
          Bạn vui lòng đăng nhập để sử dụng đầy đủ dịch vụ.
        </p>
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
          <LuMenu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0">
        {isLogged ? onRenderMenuWhenLogged() : onRenderMenuNotLoggin()}
      </SheetContent>
    </Sheet>
  );
};

export default MenubarIcon;
