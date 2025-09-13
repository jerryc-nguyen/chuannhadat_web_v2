'use client';
import React from 'react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu';
import { Bell, CheckCheck, MoreHorizontal } from 'lucide-react';
import { INotificationData } from '../types';

interface NotificationHeaderProps {
  notifications: Array<INotificationData>;
  onMarkAllAsRead?: () => Promise<void>;
  isLoading?: boolean;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  notifications,
  onMarkAllAsRead,
  isLoading = false
}) => {
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const hasUnread = unreadCount > 0 || true;

  const handleMarkAllAsRead = async () => {
    if (onMarkAllAsRead && hasUnread) {
      try {
        await onMarkAllAsRead();
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3">
        <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Thông báo</h1>
      </div>

      {notifications.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs md:text-sm text-white">
            {unreadCount} chưa đọc
          </Badge>

          {hasUnread && onMarkAllAsRead && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {isLoading ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationHeader;
