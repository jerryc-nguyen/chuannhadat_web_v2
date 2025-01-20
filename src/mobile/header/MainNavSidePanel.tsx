'use client';
import React from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { removeTokenServer } from '@app/action';
import { useRouter } from 'next/navigation';
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
    href: '/dashboard/account-settings',
    title: 'Cài đặt tài khoản',
  },
  {
    id: 3,
    href: '/dashboard/manage-post/new-post',
    title: 'Đăng tin',
  },
  {
    id: 4,
    href: '/dashboard/top-up',
    title: 'Nạp tiền',
  },
];
export default function MainNavSidePanel() {
  const { currentUser, handleSignOut } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    handleSignOut();
    removeTokenServer();
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
