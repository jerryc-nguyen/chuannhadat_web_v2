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
import { Wallet, Gift, ChevronRight, Home, FileText, Settings, CreditCard, LayoutDashboard, LogOut } from 'lucide-react';


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
      icon: isDashboardPage ? Home : LayoutDashboard,
    },
    {
      id: 1,
      href: DASHBOARD_ROUTES.posts.index,
      title: 'Quản lý tin đăng',
      icon: FileText,
    },
    {
      id: 2,
      href: DASHBOARD_ROUTES.profile.accountSettings,
      title: 'Cài đặt tài khoản',
      icon: Settings,
    },
    {
      id: 4,
      href: DASHBOARD_ROUTES.balance.topup,
      title: 'Nạp tiền',
      icon: CreditCard,
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
        {listMenubar.map((menu) => {
          const IconComponent = menu.icon;
          return (
            <li key={menu.id}>
              <a
                href={menu.href}
                className="flex items-center gap-x-3 px-6 py-4 font-medium text-gray-700 hover:bg-slate-50 hover:text-primary transition-colors border-b border-gray-100 last:border-b-0"
              >
                <IconComponent className="h-5 w-5 text-gray-500" />
                <span>{menu.title}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 px-6 pb-6">
        <Button
          className="flex w-full items-center justify-center gap-x-2 h-11 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
          variant="outline"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </section>
  );
};

export default LoggedUserPanel;
