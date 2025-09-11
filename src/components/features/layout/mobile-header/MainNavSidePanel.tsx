'use client';
import React from 'react';
import { useAuth } from '@common/auth/AuthContext';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/navigation';
import { DASHBOARD_ROUTES } from '@common/router';

const listMenubar = [
  {
    id: 0,
    href: DASHBOARD_ROUTES.index,
    title: 'Trang quản lý',
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
    id: 3,
    href: DASHBOARD_ROUTES.posts.new,
    title: 'Đăng tin',
  },
  {
    id: 4,
    href: DASHBOARD_ROUTES.balance.topup,
    title: 'Nạp tiền',
  },
];
export default function MainNavSidePanel() {
  const { currentUser, logout } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="font-bold text-primary_color">{currentUser?.full_name}</h2>
        <span className="text-sm text-secondary">Mã thành viên: {currentUser?.id}</span>
      </div>

      <ul>
        {listMenubar.map((menu) => (
          <li
            className="border-b py-3 font-medium hover:bg-slate-100 hover:underline"
            key={menu.id}
          >
            <Link className='w-full' href={menu.href}>{menu.title}</Link>
          </li>
        ))}
      </ul>
      <Button className="flex items-center gap-x-2" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </>
  );
}
