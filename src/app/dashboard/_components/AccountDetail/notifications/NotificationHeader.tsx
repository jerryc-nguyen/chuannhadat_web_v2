'use client';
import React from 'react';
import { Badge } from '@components/ui/badge';
import { Bell } from 'lucide-react';

interface NotificationHeaderProps {
  notifications: Array<{
    id: number;
    is_read: boolean;
    title: string;
    description: string;
    formatted_created_at: string;
    redirect_url: string;
  }>;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({ notifications }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3">
        <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Thông báo</h1>
      </div>
      {notifications.length > 0 && (
        <Badge variant="secondary" className="text-xs md:text-sm text-white">
          {notifications.filter(n => !n.is_read).length} chưa đọc
        </Badge>
      )}
    </div>
  );
};

export default NotificationHeader;
