'use client';

import { useAuth } from '@common/auth/AuthContext';
import { Button } from '@components/ui/button';
import {
  SheetDescription,
  SheetTitle,
} from '@components/ui/sheet';
import { DASHBOARD_ROUTES } from '@common/router';
import { usePathname, useRouter } from 'next/navigation';


const LoggedUserPanel: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const pathName = usePathname() || '';
  const isDashboardPage = pathName.includes('dashboard');

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

  const handleLogout = () => {
    logout();
    router.refresh();
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <section>
      <div className="flex flex-col p-6">
        <SheetTitle className="font-bold text-primary_color">{currentUser?.full_name}</SheetTitle>
        <SheetDescription className="text-sm text-secondary">
          Mã thành viên: {currentUser?.id}
        </SheetDescription>
      </div>

      <div className="mb-4 px-6">
        <a href={DASHBOARD_ROUTES.posts.new}>
          <Button className="flex w-full items-center gap-x-2">
            Đăng tin
          </Button>
        </a>
        <a href={DASHBOARD_ROUTES.balance.topup}>
          <Button className="mt-2 flex w-full items-center gap-x-2">
            Nạp tiền
          </Button>
        </a>
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

export default LoggedUserPanel;
