'use client';

import MainNavRight from './MainNavRight';
import { Input } from '@/components/ui/input';
import { LuSearch } from 'react-icons/lu';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { useEffect } from 'react';
import useAuth from '@mobile/auth/hooks/useAuth';
import MainNavLocationsPicker from './MainNavLocationsPicker';

export default function MainNav() {
  const { loadMore } = usePaginatedNotifications();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadMore();
  }, [currentUser]);

  return (
    <div className="flex items-center justify-between bg-white py-2">
      <a href="/" className="mr-4 flex items-center space-x-2">
        <img src="https://chuannhadat.com/images/logo_mobile@2x.png" width="40" alt="Logo" />
      </a>

      <div className="relative md:w-1/3">
        <MainNavLocationsPicker />
      </div>

      <div className="flex items-center">
        <MainNavRight />
      </div>
    </div>
  );
}
