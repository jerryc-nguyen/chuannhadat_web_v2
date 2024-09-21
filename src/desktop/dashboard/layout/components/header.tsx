'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LuHome,
  LuLineChart,
  LuMenu,
  LuPackage,
  LuPackage2,
  LuSearch,
  LuShoppingCart,
  LuUsers,
  LuBell,
} from 'react-icons/lu';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import { Button } from '@components/ui/button';
import { ModeToggle } from '@components/ui/mode-toggle';
import useAuth from '@mobile/auth/hooks/useAuth';
import { Popover, PopoverTrigger } from '@components/ui/popover';
import NotificationsList from '@desktop/notification/NotificationsList';
import { usePaginatedNotifications } from '@desktop/notification/hooks';
import { PopoverContent } from '@radix-ui/react-popover';
type HeaderDashboardProps = {
  isMobile: boolean;
};

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({ isMobile }) => {
  const { signout, currentUser } = useAuth();
  const router = useRouter();

  const { total, notifications, loadMore, onFilter } = usePaginatedNotifications();

  const handleMarkReadAll = () => {
    return;
  };
  const handleRedirect = (id: number, is_read: boolean) => {
    return;
  };
  const handleGetNotMarkRead = (status: 'unread' | 'read' | null) => onFilter(status);

  useEffect(() => {
    loadMore();
  }, [currentUser]);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      {isMobile ? (
        <div className="relative">
          <LuBell className="h-4 w-4" />
          <Badge className="absolute right-[-15px] top-[-18px] ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
            {total}
          </Badge>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <LuBell className="h-4 w-4" />
              <Badge className="absolute right-[-15px] top-[-18px] ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
                {total}
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent className="h-[520px] w-200 filter_popover_content">
            <NotificationsList
              notifications={notifications}
              total={total}
              onLoadMore={loadMore}
              onMarkReadAll={handleMarkReadAll}
              onRedirect={handleRedirect}
              onGetNotMarkRead={handleGetNotMarkRead}
            />
          </PopoverContent>

        </Popover>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="mr-2 flex items-center justify-center">
            <img
              src={currentUser?.avatar_url}
              alt={currentUser?.full_name || 'User'}
              height={36}
              width={36}
              className="rounded-full border"
            />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard/account-settings">
            <DropdownMenuItem>Thông tin cá nhân</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signout();
              router.push('/');
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


    </header>
  );
};

export default HeaderDashboard;
