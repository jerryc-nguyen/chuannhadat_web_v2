'use client';

import { useAuth } from '@common/auth/AuthContext';
import { Button } from '@components/ui/button';
import {
  SheetDescription,
  SheetTitle,
} from '@components/ui/sheet';
import { DASHBOARD_ROUTES } from '@common/router';
import { usePathname, useRouter } from 'next/navigation';
import useBalance from '@dashboard/FinancialManagement/hooks';
import { Wallet, Gift, ChevronRight } from 'lucide-react';


const LoggedUserPanel: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { balanceData } = useBalance(); // ✅ Simplified - no more complex state management

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
      <div className="flex flex-col px-6 py-4">
        <SheetTitle className="font-bold text-primary_color">{currentUser?.full_name}</SheetTitle>
        <SheetDescription className="text-sm text-secondary">
          Mã thành viên: {currentUser?.id}
        </SheetDescription>
      </div>

      {/* Balance Information */}
      <div className="border-b bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">Thông tin tài khoản</h4>
          <a
            href={DASHBOARD_ROUTES.balance.summary}
            className="flex items-center gap-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Chi tiết</span>
            <ChevronRight className="h-3 w-3" />
          </a>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Tổng số dư</span>
            </div>
            <span className="text-sm font-bold text-green-600">{balanceData.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Gift className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">Khuyến mãi</span>
            </div>
            <span className="text-sm font-medium text-orange-600">{balanceData.tk_km}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 px-6 mt-6">
        <a href={DASHBOARD_ROUTES.posts.new}>
          <Button className="flex w-full items-center gap-x-2">
            Đăng tin
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
