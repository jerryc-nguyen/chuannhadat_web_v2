'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainNavRight from './MainNavRight';
import { Input } from '@/components/ui/input';
import { LuSearch } from 'react-icons/lu';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { useEffect } from 'react';

export default function MainNav() {
  const pathname = usePathname();

  const { loadMore } = usePaginatedNotifications();

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="flex items-center justify-between bg-white py-2">
      <Link href="/" className="mr-4 flex items-center space-x-2">
        <img src="https://chuannhadat.com/images/logo_mobile@2x.png" width="40" alt="Logo" />
      </Link>

      <div className="relative">
        <LuSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Chọn khu vực" className="rounded-full pl-8" />
      </div>

      <div className="flex items-center">
        <MainNavRight />
      </div>
    </div>
  );
}
