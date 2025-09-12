'use client';
import React from 'react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { INotificationData } from './types';

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
  const hasUnread = unreadCount > 0;

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

      <div className="flex items-center gap-2 md:gap-3">
        {hasUnread && onMarkAllAsRead && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isLoading}
            className="text-xs md:text-sm h-8 px-3"
          >
            <CheckCheck className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            {isLoading ? 'Đang xử lý...' : 'Đánh dấu tất cả đã đọc'}
          </Button>
        )}

        {notifications.length > 0 && (
          <Badge variant="secondary" className="text-xs md:text-sm text-white">
            {unreadCount} chưa đọc
          </Badge>
        )}
      </div>
    </div>
  );
};

export default NotificationHeader;
