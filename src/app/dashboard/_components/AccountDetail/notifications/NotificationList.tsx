'use client';
import React from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Bell } from 'lucide-react';
import { AxiosResponse } from 'axios';
import { IResponseData } from '@common/types/api';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: Array<{
    id: number;
    title: string;
    description: string;
    formatted_created_at: string;
    is_read: boolean;
    redirect_url: string;
  }>;
  onMarkAsRead: (id: number) => Promise<AxiosResponse<IResponseData<null>>>;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onMarkAsRead }) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4">
            <Bell className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
            <p className="text-sm md:text-base text-gray-500">Bạn sẽ nhận được thông báo khi có cập nhật mới.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={onMarkAsRead} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
