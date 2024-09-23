'use client';

import MainNavRight from './MainNavRight';

import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { useEffect } from 'react';
import { LuSearch } from 'react-icons/lu';
import { Input } from '@components/ui/input';
import useAuth from '@mobile/auth/hooks/useAuth';
import MainNavLocationsPicker from '@desktop/components/MainNavLocationsPicker';
export default function MainNav({
  onSearchClick = () => undefined,
}: {
  onSearchClick?: () => void;
}) {
  const { loadMore } = usePaginatedNotifications();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadMore();
  }, [currentUser]);

  return (
    <div>
      <div className="flex items-center justify-between bg-white py-2">
        <a href="/" className="mr-4 flex items-center space-x-2">
          <img src="https://chuannhadat.com/images/logo_mobile@2x.png" width="40" alt="Logo" />
        </a>

        <div className="flex items-center">
          <MainNavRight />
        </div>
      </div>

      <div className="relative">
        <MainNavLocationsPicker />
      </div>

    </div>
  );
}
